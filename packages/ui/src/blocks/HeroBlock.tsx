import React from 'react';

export function HeroBlock({ content }: { content: any }) {
  const { title, subtitle, backgroundImage, ctaText, ctaUrl } = content;
  return (
    <div 
      className="relative bg-navy-900 text-white py-24 px-8 text-center"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' } : {}}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
        {subtitle && <p className="text-xl md:text-2xl text-gray-300 mb-8">{subtitle}</p>}
        {ctaText && ctaUrl && (
          <a href={ctaUrl} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            {ctaText}
          </a>
        )}
      </div>
    </div>
  );
}
