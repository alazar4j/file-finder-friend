import type { ReactNode } from "react";

export function PageSection({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl">{title}</h1>
        <hr className="rule-gold my-4" />
        {lede ? <p className="max-w-2xl text-muted-foreground">{lede}</p> : null}
      </div>
      {children}
    </main>
  );
}

export function Card({ children, accent }: { children: ReactNode; accent?: "wood" | "amber" | "ruby" }) {
  const border =
    accent === "amber" ? "border-l-amber" : accent === "ruby" ? "border-l-ruby" : "border-l-wood";
  return <div className={`card-ledger mb-4 ${border}`}>{children}</div>;
}
