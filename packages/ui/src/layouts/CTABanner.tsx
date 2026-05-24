import React from 'react';

interface CTAAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export interface CTABannerProps {
  title: string;
  description: string;
  actions: CTAAction[];
  gradient?: string;
  className?: string;
}

export const CTABanner: React.FC<CTABannerProps> = ({
  title,
  description,
  actions,
  gradient = 'from-[#0134BD] to-[#121B47]',
  className = '',
}) => {
  return (
    <section className={`bg-gradient-to-r ${gradient} text-white p-8 rounded-lg text-center ${className}`}>
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-xl mb-6 max-w-2xl mx-auto">{description}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            onClick={action.onClick}
            className={
              action.variant === 'secondary'
                ? 'bg-navy-800 text-[#0134BD] px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors'
                : 'bg-[#FB6C1D] hover:bg-[#e55a1a] text-white px-6 py-3 rounded-lg font-semibold transition-colors'
            }
          >
            {action.label}
          </a>
        ))}
      </div>
    </section>
  );
};
