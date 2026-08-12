import { UserBar } from "@/components/user-bar";
import { getCurrentSession, protectedPageRedirect } from "@/lib/auth/sessions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/");
  }

  const destination = protectedPageRedirect(session, "admin");

  if (destination) {
    redirect(destination);
  }

  return (
    <main className="page-shell">
      <div className="content-container admin-placeholder">
        <UserBar email={session.email} />
        <h1>Administrace</h1>
        <p>Správa odpovědí je připravena pro další fázi implementace.</p>
      </div>
    </main>
  );
}
