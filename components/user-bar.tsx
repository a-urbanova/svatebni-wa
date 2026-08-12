import { OutlineButton } from "./ui";

export function UserBar({ email }: { email: string }) {
  return (
    <div className="user-bar">
      <p>
        Přihlášeni jako <strong>{email}</strong>
      </p>
      <form action="/api/auth/logout" method="post">
        <OutlineButton type="submit">Odhlásit se</OutlineButton>
      </form>
    </div>
  );
}
