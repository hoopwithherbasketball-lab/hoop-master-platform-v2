import React from 'react';

export interface ServiceCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  borderColor?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  price,
  description,
  features,
  borderColor = 'border-[#0134BD]',
  actionLabel = 'Get Started',
  onAction,
}) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 ${borderColor}`}>
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-[#121B47]">{title}</h3>
        <div className="text-3xl font-bold text-[#FB6C1D] mt-2">{price}</div>
      </div>
      <p className="text-gray-600 mb-4 text-center">{description}</p>
      <ul className="text-sm text-gray-600 mb-6 space-y-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-center">
            <svg className="w-4 h-4 text-[#0134BD] mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      {onAction && (
        <button
          onClick={onAction}
          className="w-full bg-[#0134BD] hover:bg-[#002a80] text-white py-2 px-4 rounded-md font-semibold transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
