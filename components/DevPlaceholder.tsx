import { isDev } from "@/lib/env";

/** Visible only in `npm run dev`. Never renders in a production build. */
export function DevPlaceholder({ title, children }: { title: string; children?: React.ReactNode }) {
  if (!isDev) return null;
  return (
    <div className="dev-placeholder" role="note">
      <strong>Development placeholder — {title}</strong>
      {children ? <div>{children}</div> : null}
    </div>
  );
}
