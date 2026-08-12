export const SESSION_COOKIE_NAME = "svatebni_session";

type SessionCookieOptions = {
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: "/";
  expires: Date;
  maxAge?: number;
};

export function sessionCookieOptions(
  expiresAt: Date,
  isProduction: boolean,
): SessionCookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    expires: expiresAt,
  };
}

export function expiredSessionCookieOptions(isProduction: boolean): SessionCookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  };
}
