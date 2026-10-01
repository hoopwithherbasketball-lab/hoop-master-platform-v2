import React from 'react';

export interface CtaBlockContent {
  title?: unknown;
  body?: unknown;
  eyebrow?: unknown;
  action?: {
    label?: string;
    href?: string;
  };
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function CtaBlock({ content }: { content: CtaBlockContent }) {
  const title = asString(content.title);
  const body = asString(content.body);
  const eyebrow = asString(content.eyebrow);
  const actionLabel = asString(content.action?.label);
  const actionHref = asString(content.action?.href);

  return (
    <section className="rounded-3xl border border-orange-400/30 bg-orange-500/15 p-8 text-center md:p-12 my-8">
      <div className="mx-auto max-w-3xl text-center">
        {eyebrow && <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange">{eyebrow}</p>}
        {title && <h2 className="mt-3 font-display text-3xl font-black text-white md:text-4xl">{title}</h2>}
        {body && <p className="mt-4 text-base leading-7 text-slate-300">{body}</p>}
      </div>
      {actionLabel && actionHref && (
        <div className="mt-8">
          <a
            href={actionHref}
            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg transition bg-brand-orange hover:bg-orange-500"
          >
            {actionLabel}
          </a>
        </div>
      )}
    </section>
  );
}
