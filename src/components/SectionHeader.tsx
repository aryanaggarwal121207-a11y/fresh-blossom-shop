import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  linkTo,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  linkTo?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</span>
        )}
        <h2 className="mt-1 font-display text-3xl font-semibold md:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-xl text-muted-foreground">{subtitle}</p>}
      </div>
      {linkTo && (
        <Link to={linkTo} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all">
          {linkLabel ?? "View all"} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}