import type { ReactNode } from "react";

export function PageSection({
  id,
  title,
  lede,
  children,
}: {
  id?: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-[1100px] min-w-0 scroll-mt-28 overflow-x-clip px-4 py-12 sm:px-6">
      <div className="mb-8 min-w-0">
        <h1 className="text-4xl md:text-5xl">{title}</h1>
        <hr className="rule-gold my-4" />
        {lede ? <p className="max-w-2xl text-muted-foreground">{lede}</p> : null}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export function Card({ children, accent }: { children: ReactNode; accent?: "wood" | "amber" | "ruby" }) {
  const border =
    accent === "amber" ? "border-l-amber" : accent === "ruby" ? "border-l-ruby" : "border-l-wood";
  return <div className={`card-ledger mb-4 ${border}`}>{children}</div>;
}
