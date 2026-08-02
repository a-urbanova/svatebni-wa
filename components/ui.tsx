import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <section className={`card ${className}`.trim()} {...props}>
      {children}
    </section>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function PrimaryButton({ className = "", children, ...props }: ButtonProps) {
  return (
    <button className={`button button-primary ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export function OutlineButton({ className = "", children, ...props }: ButtonProps) {
  return (
    <button className={`button button-outline ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="field-label">{children}</span>;
}

type StatusMessageProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
  tone?: "neutral" | "success" | "error";
};

export function StatusMessage({
  className = "",
  children,
  tone = "neutral",
  ...props
}: StatusMessageProps) {
  return (
    <p
      className={`status-message status-message-${tone} ${className}`.trim()}
      role={tone === "error" ? "alert" : "status"}
      {...props}
    >
      {children}
    </p>
  );
}

export function RingsMotif({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={compact ? "rings-motif rings-motif-compact" : "rings-motif"}
      viewBox="0 0 76 52"
    >
      <path d="M28 7l3.1 5.4H24.9L28 7Z" />
      <path d="M48 7l3.1 5.4H44.9L48 7Z" />
      <circle cx="29" cy="31" r="16" />
      <circle cx="47" cy="31" r="16" />
    </svg>
  );
}

export function SectionDivider() {
  return (
    <div className="section-divider" aria-hidden="true">
      <span />
      <i>✦</i>
      <span />
    </div>
  );
}
