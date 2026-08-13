import { InvitationSection } from "@/components/invitation";
import { HostRsvpForm } from "@/components/host-rsvp-form";
import { UserBar } from "@/components/user-bar";
import { SkipLink } from "@/components/ui";
import { getCurrentSession, protectedPageRedirect } from "@/lib/auth/sessions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HostPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/");
  }

  const destination = protectedPageRedirect(session, "host");

  if (destination) {
    redirect(destination);
  }

  return (
    <>
      <SkipLink href="#host-rsvp" />
      <main className="page-shell page-shell-invitation">
        <div className="content-container content-container-narrow">
          <InvitationSection />
          <UserBar email={session.email} />
          <HostRsvpForm />
        </div>
      </main>
    </>
  );
}
