import React from 'react';

export function FeaturesBlock({ content }: { content: any }) {
  const { title, features } = content;
  return (
    <div className="py-16 px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="grid md:grid-cols-3 gap-8">
          {(features || []).map((feature: any, idx: number) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                {feature.icon || '✨'}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
