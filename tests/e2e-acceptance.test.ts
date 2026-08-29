import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

import { MongoClient } from "mongodb";

import { hashSecret } from "../lib/auth/secrets.ts";
import { ensureDatabaseIndexes } from "../lib/db/indexes.ts";

const enabled = process.env.RUN_E2E_TESTS === "true";
const databaseName = "svatebni_wa_e2e_test";
const baseUrl = "http://127.0.0.1:3109";
const weddingCode = "e2e-bezpecny-kod";

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForServer(server: ChildProcess, output: string[]): Promise<void> {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Vývojový server předčasně skončil.\n${output.join("")}`);
    }

    try {
      const response = await fetch(`${baseUrl}/`);
      if (response.ok) return;
    } catch {
      // Server se ještě spouští.
    }
    await delay(250);
  }

  throw new Error(`Vývojový server se nespustil včas.\n${output.join("")}`);
}

async function stopServer(server: ChildProcess) {
  if (server.exitCode !== null) return;

  server.kill("SIGTERM");
  await Promise.race([
    once(server, "exit"),
    delay(5_000).then(() => {
      if (server.exitCode === null) server.kill("SIGKILL");
    }),
  ]);
}

function sessionCookie(response: Response): string {
  const value = response.headers.get("set-cookie");
  const match = value?.match(/svatebni_session=[^;]+/);
  assert.ok(match, "Ověření magic linku musí nastavit session cookie.");
  return match[0];
}

function redirectPath(response: Response): string {
  const location = response.headers.get("location");
  assert.ok(location, "Přesměrování musí obsahovat hlavičku Location.");
  return new URL(location, baseUrl).pathname + new URL(location, baseUrl).search;
}

async function requestDevelopmentMagicLink(email: string): Promise<string> {
  const response = await fetch(`${baseUrl}/api/auth/magic-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: baseUrl },
    body: JSON.stringify({ email, weddingCode }),
  });
  if (response.status !== 200) {
    throw new Error(`Žádost o vývojový magic link selhala (${response.status}): ${await response.text()}`);
  }

  const body = await response.json() as { developmentMagicLink?: string; kind?: string };
  assert.equal(body.kind, "success");
  const magicLink = body.developmentMagicLink;
  if (!magicLink?.startsWith(`${baseUrl}/auth/verify?token=`)) {
    throw new Error("Vývojová odpověď neobsahuje očekávaný magic link.");
  }
  return magicLink;
}

async function verifyMagicLink(magicLink: string, destination: "/host" | "/admin"): Promise<string> {
  const response = await fetch(magicLink, { redirect: "manual" });
  assert.equal(response.status, 307);
  assert.equal(redirectPath(response), destination);
  return sessionCookie(response);
}

test("e2e: magic link, RSVP více osob, role správce a odhlášení", { skip: enabled ? false : "E2E se spouští jen příkazem pnpm test:e2e." }, async () => {
  const uri = process.env.MONGODB_TEST_URI;
  if (!uri) {
    throw new Error("Pro e2e test nastavte MONGODB_TEST_URI v .env.test.");
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5_000 });
  const database = client.db(databaseName);
  const serverOutput: string[] = [];
  let server: ChildProcess | null = null;
  const tsconfigPath = join(process.cwd(), "tsconfig.json");
  let originalTsconfig: string | null = null;

  try {
    await client.connect();
    await database.dropDatabase();
    await ensureDatabaseIndexes(database);

    originalTsconfig = await readFile(tsconfigPath, "utf8");

    server = spawn(
      process.execPath,
      ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", "3109"],
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          APP_URL: baseUrl,
          ENABLE_DEV_MAGIC_LINK: "true",
          MONGODB_DB_NAME: databaseName,
          MONGODB_URI: uri,
          NEXT_DIST_DIR: ".next-e2e",
          WEDDING_CODE: weddingCode,
        },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    server.stdout?.on("data", (chunk: Buffer) => serverOutput.push(chunk.toString()));
    server.stderr?.on("data", (chunk: Buffer) => serverOutput.push(chunk.toString()));
    await waitForServer(server, serverOutput);

    const guestMagicLink = await requestDevelopmentMagicLink("host-e2e@example.test");
    const guestSession = await verifyMagicLink(guestMagicLink, "/host");

    const initialRsvp = await fetch(`${baseUrl}/api/rsvp`, { headers: { Cookie: guestSession } });
    assert.equal(initialRsvp.status, 200);
    assert.deepEqual(await initialRsvp.json(), { rsvp: null });

    const submission = {
      persons: [
        {
          id: "e2e-adult",
          firstName: "Ada",
          lastName: "Ukázková",
          type: "adult",
          overnightStay: true,
          needsTransport: false,
          dietaryChoice: "none",
        },
        {
          id: "e2e-child",
          firstName: "Filip",
          lastName: "Ukázkový",
          type: "child",
          overnightStay: false,
          needsTransport: false,
          dietaryChoice: "vegetarian",
        },
        {
          id: "e2e-transport",
          firstName: "Berta",
          lastName: "Ukázková",
          type: "adult",
          overnightStay: false,
          needsTransport: true,
          transportDestination: "Ukázkové nádraží",
          dietaryChoice: "other",
          dietaryDetails: "Ukázkové upřesnění",
          note: "Ukázková poznámka.",
        },
      ],
      sharedMessage: "Ukázková společná zpráva.",
    };
    const savedRsvp = await fetch(`${baseUrl}/api/rsvp`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: guestSession, Origin: baseUrl },
      body: JSON.stringify(submission),
    });
    assert.equal(savedRsvp.status, 200);

    const reloadedRsvp = await fetch(`${baseUrl}/api/rsvp`, { headers: { Cookie: guestSession } });
    assert.equal(reloadedRsvp.status, 200);
    const reloadedBody = await reloadedRsvp.json() as { rsvp: { persons: Array<{ id: string }>; sharedMessage?: string } };
    assert.deepEqual(reloadedBody.rsvp.persons.map((person) => person.id), ["e2e-adult", "e2e-child", "e2e-transport"]);
    assert.equal(reloadedBody.rsvp.sharedMessage, submission.sharedMessage);

    const secondGuestMagicLink = await requestDevelopmentMagicLink("second-e2e@example.test");
    const secondGuestSession = await verifyMagicLink(secondGuestMagicLink, "/host");
    const secondGuestRsvp = await fetch(`${baseUrl}/api/rsvp`, { headers: { Cookie: secondGuestSession } });
    assert.deepEqual(await secondGuestRsvp.json(), { rsvp: null });

    const guestAdminPage = await fetch(`${baseUrl}/admin`, {
      headers: { Cookie: guestSession },
      redirect: "manual",
    });
    assert.equal(guestAdminPage.status, 307);
    assert.equal(redirectPath(guestAdminPage), "/host");
    const guestAdminApi = await fetch(`${baseUrl}/api/admin/rsvps`, { headers: { Cookie: guestSession } });
    assert.equal(guestAdminApi.status, 403);

    const adminMagicLink = await requestDevelopmentMagicLink("svatebniwa+anna@gmail.com");
    const adminSession = await verifyMagicLink(adminMagicLink, "/admin");
    const adminOverview = await fetch(`${baseUrl}/api/admin/rsvps`, { headers: { Cookie: adminSession } });
    assert.equal(adminOverview.status, 200);
    const overviewBody = await adminOverview.json() as { overview: { rows: Array<{ ownerEmail: string }>; summary: Record<string, number> } };
    assert.equal(overviewBody.overview.rows.length, 3);
    assert.ok(overviewBody.overview.rows.every((row) => row.ownerEmail === "host-e2e@example.test"));
    assert.deepEqual(overviewBody.overview.summary, {
      totalPersons: 3,
      adults: 2,
      children: 1,
      overnightStays: 1,
    });

    const repeatedMagicLink = await fetch(guestMagicLink, { redirect: "manual" });
    assert.equal(repeatedMagicLink.status, 307);
    assert.equal(redirectPath(repeatedMagicLink), "/?auth=invalid-link");

    const expiredMagicLink = await requestDevelopmentMagicLink("expired-e2e@example.test");
    const token = new URL(expiredMagicLink).searchParams.get("token");
    assert.ok(token);
    await database.collection("loginTokens").updateOne(
      { tokenHash: hashSecret(token) },
      { $set: { expiresAt: new Date(0) } },
    );
    const expiredResponse = await fetch(expiredMagicLink, { redirect: "manual" });
    assert.equal(expiredResponse.status, 307);
    assert.equal(redirectPath(expiredResponse), "/?auth=invalid-link");

    const logout = await fetch(`${baseUrl}/api/auth/logout`, {
      method: "POST",
      headers: { Cookie: guestSession, Origin: baseUrl },
      redirect: "manual",
    });
    assert.equal(logout.status, 303);
    assert.equal(redirectPath(logout), "/");
    const afterLogout = await fetch(`${baseUrl}/api/rsvp`, { headers: { Cookie: guestSession } });
    assert.equal(afterLogout.status, 401);
  } finally {
    if (server) await stopServer(server);
    if (originalTsconfig) await writeFile(tsconfigPath, originalTsconfig).catch(() => undefined);
    await rm(join(process.cwd(), ".next-e2e"), { recursive: true, force: true }).catch(() => undefined);
    await database.dropDatabase().catch(() => undefined);
    await client.close().catch(() => undefined);
  }
});
