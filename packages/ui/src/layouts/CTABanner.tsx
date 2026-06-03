import React from 'react';

interface CTAAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  testId?: string;
}

export interface CTABannerProps {
  title: string;
  description: string;
  actions: CTAAction[];
  gradient?: string;
  className?: string;
  renderAction?: (action: CTAAction, className: string, key: string) => React.ReactNode;
  LinkComponent?: React.ElementType;
}

const getSafeId = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const CTABanner: React.FC<CTABannerProps> = ({
  title,
  description,
  actions,
  gradient = 'from-[#0134BD] to-[#121B47]',
  className = '',
  renderAction,
  LinkComponent,
}) => {
  const titleId = `cta-banner-${getSafeId(title)}-heading`

  return (
    <section
      className={`bg-gradient-to-r ${gradient} text-white p-8 rounded-lg text-center ${className}`}
      aria-labelledby={titleId}
    >
      <h2 id={titleId} className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-xl mb-6 max-w-2xl mx-auto">{description}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {actions.map((action, index) => {
          const actionKey = `${getSafeId(action.label)}-${index}`
          const isExternal = action.href?.startsWith('http');
          const actionTestId = action.testId || `cta-banner-action-${getSafeId(action.label)}`
          const linkClasses = action.variant === 'secondary'
            ? 'bg-navy-800 text-[#0134BD] px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors'
            : 'bg-[#FB6C1D] hover:bg-[#e55a1a] text-white px-6 py-3 rounded-lg font-semibold transition-colors';

          if (action.href) {
            if (isExternal) {
              return (
                <a
                  key={actionKey}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={action.label}
                  className={linkClasses}
                  onClick={action.onClick}
                  data-testid={actionTestId}
                >
                  {action.label}
                </a>
              )
            }

            if (LinkComponent) {
              const LinkTag = LinkComponent as React.ElementType
              return (
                <LinkTag
                  key={actionKey}
                  to={action.href}
                  className={linkClasses}
                  aria-label={action.label}
                  onClick={action.onClick}
                  data-testid={actionTestId}
                >
                  {action.label}
                </LinkTag>
              )
            }

            if (renderAction) {
              return <React.Fragment key={actionKey}>{renderAction(action, linkClasses, actionKey)}</React.Fragment>
            }

            return (
              <a
                key={actionKey}
                href={action.href}
                aria-label={action.label}
                className={linkClasses}
                onClick={action.onClick}
                data-testid={actionTestId}
              >
                {action.label}
              </a>
            )
          }

          return (
            <button
              key={actionKey}
              type="button"
              onClick={action.onClick}
              className={linkClasses}
              aria-label={action.label}
              data-testid={actionTestId}
            >
              {action.label}
            </button>
          )
        })}
      </div>
    </section>
  );
};
