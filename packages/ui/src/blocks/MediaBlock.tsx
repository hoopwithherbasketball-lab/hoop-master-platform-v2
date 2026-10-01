import React from 'react';

interface MediaBlockContent {
  title?: unknown;
  body?: unknown;
  eyebrow?: unknown;
  provider?: unknown;
  embedUrl?: unknown;
  caption?: unknown;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function MediaBlock({ content }: { content: MediaBlockContent }) {
  const title = asString(content.title);
  const body = asString(content.body);
  const eyebrow = asString(content.eyebrow);
  const provider = asString(content.provider);
  const embedUrl = asString(content.embedUrl);
  const caption = asString(content.caption);

  return (
    <section className="rounded-3xl border border-white/10 bg-navy-800 p-6 md:p-8 my-8">
      <div className="max-w-3xl">
        {eyebrow && <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange">{eyebrow}</p>}
        {title && <h2 className="mt-3 font-display text-3xl font-black text-white md:text-4xl">{title}</h2>}
        {body && <p className="mt-4 text-base leading-7 text-slate-300">{body}</p>}
      </div>
      <a href={embedUrl || '#'} target="_blank" rel="noreferrer" className="mt-6 flex aspect-video items-center justify-center rounded-2xl border border-orange-400/30 bg-navy-900 text-center transition hover:bg-white/5">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-brand-orange">{provider || 'Media'}</p>
          <p className="mt-3 text-sm text-slate-400">Open media source</p>
        </div>
      </a>
      {caption && <p className="mt-3 text-xs text-slate-500">{caption}</p>}
    </section>
  );
}
