import { AdminDashboard } from "@/components/admin-dashboard";
import { UserBar } from "@/components/user-bar";
import { RingsMotif, SectionDivider, SkipLink } from "@/components/ui";
import { getCurrentSession, protectedPageRedirect } from "@/lib/auth/sessions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/");
  }

  const destination = protectedPageRedirect(session, "admin");

  if (destination) {
    redirect(destination);
  }

  const rawSearchParams = await searchParams;
  const initialSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(rawSearchParams)) {
    if (typeof value === "string") {
      initialSearchParams.set(key, value);
    } else if (Array.isArray(value)) {
      for (const item of value) initialSearchParams.append(key, item);
    }
  }

  return (
    <>
      <SkipLink href="#admin-dashboard" />
      <main className="page-shell admin-page-shell">
        <div className="content-container admin-page-content">
          <header className="admin-page-header">
            <div className="admin-heading">
              <RingsMotif compact />
              <div>
                <h1 id="admin-overview-title">Přehled odpovědí hostů</h1>
                <p>Anna &amp; Petr · 21. září 2026</p>
              </div>
            </div>
            <UserBar className="admin-user-bar" email={session.email} />
          </header>
          <SectionDivider />
          <AdminDashboard initialSearch={initialSearchParams.toString()} key={initialSearchParams.toString()} />
        </div>
      </main>
    </>
  );
}
