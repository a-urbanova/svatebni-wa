import { OutlineButton } from "./ui";

export function UserBar({ email, className = "" }: { email: string; className?: string }) {
  return (
    <div className={`user-bar ${className}`.trim()}>
      <p>
        Přihlášeni jako <strong>{email}</strong>
      </p>
      <form action="/api/auth/logout" method="post">
        <OutlineButton type="submit">Odhlásit se</OutlineButton>
      </form>
    </div>
  );
}
