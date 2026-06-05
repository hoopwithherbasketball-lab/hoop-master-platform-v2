import type { PageBuilder } from '@hoop-master/features'

type PageBlock = PageBuilder.PageBlock
type PageDefinition = PageBuilder.PageDefinition
type PageTheme = PageBuilder.PageTheme

const accentClasses: Record<PageTheme['accent'], { text: string; bg: string; border: string; button: string }> = {
  blue: { text: 'text-royal-300', bg: 'bg-royal-500/15', border: 'border-royal-400/30', button: 'bg-royal-600 hover:bg-royal-500' },
  orange: { text: 'text-brand-orange', bg: 'bg-orange-500/15', border: 'border-orange-400/30', button: 'bg-brand-orange hover:bg-orange-500' },
  gold: { text: 'text-brand-gold', bg: 'bg-yellow-500/15', border: 'border-yellow-400/30', button: 'bg-brand-gold hover:bg-yellow-500 text-navy-900' },
  navy: { text: 'text-slate-200', bg: 'bg-navy-700', border: 'border-white/10', button: 'bg-navy-700 hover:bg-navy-600' },
}

interface Props {
  page: PageDefinition
  preview?: boolean
}

function ActionLink({ href, label, variant = 'primary', theme }: { href: string; label: string; variant?: 'primary' | 'secondary'; theme: PageTheme }) {
  const accent = accentClasses[theme.accent]
  return (
    <a
      href={href}
      className={variant === 'primary'
        ? `inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg transition ${accent.button}`
        : 'inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10'}
    >
      {label}
    </a>
  )
}

function SectionHeader({ block, centered = false }: { block: PageBlock; centered?: boolean }) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {block.eyebrow && <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange">{block.eyebrow}</p>}
      {block.title && <h2 className="mt-3 font-display text-3xl font-black text-white md:text-4xl">{block.title}</h2>}
      {block.body && <p className="mt-4 text-base leading-7 text-slate-300">{block.body}</p>}
    </div>
  )
}

function renderBlock(block: PageBlock, theme: PageTheme) {
  const accent = accentClasses[theme.accent]

  switch (block.type) {
    case 'hero':
      return (
        <section key={block.id} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-navy-900 px-6 py-16 shadow-2xl md:px-12 md:py-24">
          <div className={`absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl ${accent.bg}`} />
          <div className="relative max-w-4xl">
            {block.eyebrow && <p className={`text-xs font-black uppercase tracking-[0.35em] ${accent.text}`}>{block.eyebrow}</p>}
            <h1 className="mt-4 font-display text-4xl font-black leading-tight text-white md:text-6xl">{block.title}</h1>
            {block.body && <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{block.body}</p>}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {block.primaryAction && <ActionLink {...block.primaryAction} theme={theme} />}
              {block.secondaryAction && <ActionLink {...block.secondaryAction} theme={theme} variant="secondary" />}
            </div>
          </div>
        </section>
      )
    case 'richText':
      return (
        <section key={block.id} className="rounded-3xl border border-white/10 bg-navy-800 p-6 md:p-10">
          <SectionHeader block={block} />
          <div className="mt-6 whitespace-pre-line text-base leading-8 text-slate-300">{block.content}</div>
        </section>
      )
    case 'featureGrid':
      return (
        <section key={block.id} className="space-y-8">
          <SectionHeader block={block} centered />
          <div className="grid gap-5 md:grid-cols-3">
            {block.items.map(item => (
              <div key={item.title} className={`rounded-3xl border ${accent.border} bg-navy-800 p-6`}>
                {item.icon && <div className={`mb-4 inline-flex rounded-2xl ${accent.bg} px-3 py-2 text-sm font-black ${accent.text}`}>{item.icon}</div>}
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      )
    case 'stats':
      return (
        <section key={block.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-10">
          <SectionHeader block={block} centered />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {block.stats.map(stat => (
              <div key={stat.label} className="rounded-2xl bg-navy-800 p-6 text-center">
                <p className={`font-display text-4xl font-black ${accent.text}`}>{stat.value}</p>
                <p className="mt-2 text-sm font-bold text-white">{stat.label}</p>
                {stat.helper && <p className="mt-1 text-xs text-slate-500">{stat.helper}</p>}
              </div>
            ))}
          </div>
        </section>
      )
    case 'cta':
      return (
        <section key={block.id} className={`rounded-3xl border ${accent.border} ${accent.bg} p-8 text-center md:p-12`}>
          <SectionHeader block={block} centered />
          <div className="mt-8"><ActionLink {...block.action} theme={theme} /></div>
        </section>
      )
    case 'mediaEmbed':
      return (
        <section key={block.id} className="rounded-3xl border border-white/10 bg-navy-800 p-6 md:p-8">
          <SectionHeader block={block} />
          <a href={block.embedUrl} className={`mt-6 flex aspect-video items-center justify-center rounded-2xl border ${accent.border} bg-navy-900 text-center transition hover:bg-white/5`}>
            <div>
              <p className={`text-sm font-black uppercase tracking-[0.25em] ${accent.text}`}>{block.provider}</p>
              <p className="mt-3 text-sm text-slate-400">Open media source</p>
            </div>
          </a>
          {block.caption && <p className="mt-3 text-xs text-slate-500">{block.caption}</p>}
        </section>
      )
    case 'leadCapture':
      return (
        <section key={block.id} id={block.id} className="rounded-3xl border border-white/10 bg-navy-800 p-6 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
            <SectionHeader block={block} />
            <div className="rounded-2xl border border-white/10 bg-navy-900 p-5">
              <p className={`text-xs font-black uppercase tracking-[0.25em] ${accent.text}`}>{block.formName}</p>
              <div className="mt-5 space-y-3">
                {block.fields.map(field => (
                  <div key={field} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm capitalize text-slate-400">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </div>
                ))}
              </div>
              <button type="button" className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-bold text-white ${accent.button}`}>{block.submitLabel}</button>
              <p className="mt-3 text-xs text-slate-500">Preview only. Persistence connects in the data/forms phase.</p>
            </div>
          </div>
        </section>
      )
    default:
      return null
  }
}

export default function PageRenderer({ page, preview = false }: Props) {
  const surface = page.theme.surface === 'light' ? 'bg-slate-100 text-navy-900' : 'bg-navy-950 text-white'

  return (
    <article className={`min-h-screen ${surface}`}>
      {preview && (
        <div className="border-b border-white/10 bg-navy-900 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
          Preview mode · {page.status}
        </div>
      )}
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        {page.blocks.map(block => renderBlock(block, page.theme))}
      </div>
    </article>
  )
}
