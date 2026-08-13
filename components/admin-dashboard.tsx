"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";

import type { AdminOverview, AdminSummary, StoredAdminRsvpRow } from "@/lib/rsvp/admin-overview";
import type { DietaryChoice, PersonType } from "@/lib/rsvp/types";

import { Card, StatusMessage } from "./ui";
import {
  filtersFromSearchParams,
  filtersToSearchParams,
  getAdminDashboardPhase,
  hasActiveAdminFilters,
  initialAdminDashboardFilters,
  type AdminDashboardFilters,
} from "./admin-dashboard-state";

const dietaryLabels: Record<DietaryChoice, string> = {
  none: "Žádná",
  vegetarian: "Vegetariánská",
  vegan: "Veganská",
  "gluten-free": "Bezlepková",
  "lactose-free": "Bezlaktózová",
  other: "Jiná",
};

const personTypeLabels: Record<PersonType, string> = {
  adult: "Dospělý",
  child: "Dítě",
};

const emptySummary: AdminSummary = {
  totalPersons: 0,
  adults: 0,
  children: 0,
  overnightStays: 0,
};

type AdminApiResponse = { message?: string; overview?: AdminOverview };

function formatUpdatedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("cs-CZ", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Prague",
  }).format(date);
}

function messageForRow(row: StoredAdminRsvpRow): string {
  const messages = [
    row.note ? `Poznámka: ${row.note}` : "",
    row.sharedMessage ? `Zpráva: ${row.sharedMessage}` : "",
  ].filter(Boolean);
  return messages.join(" ") || "—";
}

function transportForRow(row: StoredAdminRsvpRow): string {
  if (!row.needsTransport) return "Ne";
  return row.transportDestination ? `Ano — ${row.transportDestination}` : "Ano";
}

function summaryCards(summary: AdminSummary) {
  return [
    ["Celkem osob", summary.totalPersons],
    ["Dospělí", summary.adults],
    ["Děti", summary.children],
    ["Přespání", summary.overnightStays],
  ] as const;
}

function formatPersonCount(count: number): string {
  if (count === 1) return "osoba";
  if (count >= 2 && count <= 4) return "osoby";
  return "osob";
}

export function AdminDashboard({ initialSearch }: { initialSearch: string }) {
  const [filters, setFilters] = useState<AdminDashboardFilters>(() =>
    filtersFromSearchParams(new URLSearchParams(initialSearch)),
  );
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const requestId = useRef(0);

  const loadOverview = useCallback(async (nextFilters: AdminDashboardFilters) => {
    const request = ++requestId.current;
    setIsLoading(true);
    setError("");

    const searchParams = filtersToSearchParams(nextFilters);
    const query = searchParams.toString();

    try {
      const response = await fetch(`/api/admin/rsvps${query ? `?${query}` : ""}`, {
        cache: "no-store",
      });
      const data = (await response.json().catch(() => ({}))) as AdminApiResponse;
      if (request !== requestId.current) return;

      if (response.status === 401) {
        setError("Přihlášení vypršelo. Přihlaste se prosím znovu.");
        setOverview(null);
        return;
      }
      if (!response.ok || !data.overview) {
        setError(data.message ?? "Přehled se teď nepodařilo načíst. Zkuste to prosím později.");
        setOverview(null);
        return;
      }

      setOverview(data.overview);
    } catch {
      if (request === requestId.current) {
        setError("Přehled se teď nepodařilo načíst. Zkuste to prosím později.");
        setOverview(null);
      }
    } finally {
      if (request === requestId.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const searchParams = filtersToSearchParams(filters);
    const query = searchParams.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history.replaceState(null, "", nextUrl);

    const timer = window.setTimeout(() => {
      void loadOverview(filters);
    }, filters.search ? 220 : 0);
    return () => window.clearTimeout(timer);
  }, [filters, loadOverview]);

  function updateFilters(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function resetFilters() {
    setFilters(initialAdminDashboardFilters);
  }

  const phase = getAdminDashboardPhase(isLoading, error, overview?.rows.length ?? null);
  const summary = overview?.summary ?? emptySummary;
  const activeFilters = hasActiveAdminFilters(filters);
  const resultAnnouncement =
    phase === "ready"
      ? `Zobrazeno ${overview?.rows.length ?? 0} ${formatPersonCount(overview?.rows.length ?? 0)}.`
      : phase === "empty"
        ? activeFilters
          ? "Filtrům neodpovídá žádná osoba."
          : "Zatím nejsou žádné odpovědi."
        : "";

  return (
    <section
      aria-busy={isLoading}
      aria-labelledby="admin-overview-title"
      className="admin-dashboard"
      id="admin-dashboard"
    >
      <div className="admin-summary-grid">
        {summaryCards(summary).map(([label, value]) => (
          <Card className="admin-summary-card" key={label}>
            <p>{label}</p>
            <strong aria-label={`${label}: ${value}`}>{value}</strong>
          </Card>
        ))}
      </div>

      <form className="admin-filters" onSubmit={(event) => event.preventDefault()}>
        <label className="admin-filter-field">
          <span className="field-label">Hledat podle jména nebo e-mailu</span>
          <span className="admin-search-field">
            <span aria-hidden="true" className="admin-search-icon">⌕</span>
            <input
              name="search"
              onChange={updateFilters}
              placeholder="Například Anna nebo email@domena.cz"
              type="search"
              value={filters.search}
            />
          </span>
        </label>
        <label className="admin-filter-field">
          <span className="field-label">Typ osoby</span>
          <span className="admin-select-field">
            <select name="personType" onChange={updateFilters} value={filters.personType}>
              <option value="">Typ osoby</option>
              <option value="adult">Dospělý</option>
              <option value="child">Dítě</option>
            </select>
          </span>
        </label>
        <label className="admin-filter-field">
          <span className="field-label">Přespání</span>
          <span className="admin-select-field">
            <select name="overnightStay" onChange={updateFilters} value={filters.overnightStay}>
              <option value="">Přespání</option>
              <option value="true">Ano</option>
              <option value="false">Ne</option>
            </select>
          </span>
        </label>
        <label className="admin-filter-field">
          <span className="field-label">Dieta</span>
          <span className="admin-select-field">
            <select name="dietaryChoice" onChange={updateFilters} value={filters.dietaryChoice}>
              <option value="">Dieta</option>
              {Object.entries(dietaryLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </span>
        </label>
        {activeFilters ? <button className="admin-clear-filters" onClick={resetFilters} type="button">Zrušit filtry</button> : null}
      </form>
      <p aria-atomic="true" aria-live="polite" className="sr-only">{resultAnnouncement}</p>

      {phase === "loading" ? <div className="admin-data-state" role="status">Načítáme odpovědi hostů…</div> : null}
      {phase === "error" ? (
        <div className="admin-data-state">
          <StatusMessage tone="error">{error}</StatusMessage>
          {error.startsWith("Přihlášení") ? <p><Link href="/">Přejít na přihlášení</Link></p> : (
            <button className="retry-load-button" onClick={() => void loadOverview(filters)} type="button">Zkusit načíst znovu</button>
          )}
        </div>
      ) : null}
      {phase === "empty" ? (
        <div className="admin-data-state admin-empty-state">
          <h2>{activeFilters ? "Žádná odpověď neodpovídá filtrům" : "Zatím tu nejsou žádné odpovědi"}</h2>
          <p>{activeFilters ? "Upravte vyhledávání nebo zrušte filtry a zkuste to znovu." : "Jakmile hosté odešlou své odpovědi, zobrazí se zde jejich přehled."}</p>
          {activeFilters ? <button className="admin-clear-filters" onClick={resetFilters} type="button">Zrušit filtry</button> : null}
        </div>
      ) : null}
      {phase === "ready" && overview ? <AdminRowsTable rows={overview.rows} /> : null}
    </section>
  );
}

function AdminRowsTable({ rows }: { rows: StoredAdminRsvpRow[] }) {
  return (
    <div
      aria-label="Tabulka odpovědí hostů; pro zobrazení dalších sloupců použijte vodorovné posouvání."
      className="admin-table-scroll"
      role="region"
      tabIndex={0}
    >
      <table className="admin-table">
        <caption>Seznam odpovědí hostů</caption>
        <thead><tr><th scope="col">Jméno</th><th scope="col">Typ</th><th scope="col">Přespání</th><th scope="col">Odvoz a cíl</th><th scope="col">Dieta</th><th scope="col">Poznámka nebo zpráva</th><th scope="col">E-mail odesílatele</th><th scope="col">Naposledy upraveno</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.ownerEmail}-${row.id}`}>
              <th scope="row">{row.firstName} {row.lastName}</th>
              <td><span className="admin-badge">{personTypeLabels[row.type]}</span></td>
              <td><span className={row.overnightStay ? "admin-yes" : "admin-no"}>{row.overnightStay ? "Ano" : "Ne"}</span></td>
              <td>{transportForRow(row)}</td>
              <td>{dietaryLabels[row.dietaryChoice]}{row.dietaryDetails ? ` — ${row.dietaryDetails}` : ""}</td>
              <td className="admin-long-value">{messageForRow(row)}</td>
              <td className="admin-long-value">{row.ownerEmail}</td>
              <td>{formatUpdatedAt(row.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
