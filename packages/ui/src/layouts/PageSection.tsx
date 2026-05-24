import React from 'react';

export interface PageSectionProps {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export const PageSection: React.FC<PageSectionProps> = ({
  title,
  description,
  className = '',
  children,
}) => {
  return (
    <section className={`mb-12 ${className}`}>
      {title && (
        <h2 className="text-3xl font-bold text-center text-white mb-8">{title}</h2>
      )}
      {description && (
        <p className="text-center text-slate-400 max-w-2xl mx-auto mb-8">{description}</p>
      )}
      {children}
    </section>
  );
};
