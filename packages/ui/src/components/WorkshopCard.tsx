import React from 'react';

export interface WorkshopCardProps {
  title: string;
  description: string;
  duration: string;
  format: string;
  topics: string[];
  actionLabel?: string;
  onAction?: () => void;
}

export const WorkshopCard: React.FC<WorkshopCardProps> = ({
  title,
  description,
  duration,
  format,
  topics,
  actionLabel = 'Book Workshop',
  onAction,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#0134BD]">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-semibold text-[#121B47]">{title}</h3>
        <span className="bg-[#FB6C1D] text-white px-3 py-1 rounded-full text-sm font-medium shrink-0 ml-4">
          {duration}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="mb-4">
        <span className="font-semibold text-[#121B47]">Format:</span> {format}
      </div>
      <div className="mb-6">
        <h4 className="font-semibold text-[#121B47] mb-2">What You'll Learn:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {topics.map((topic) => (
            <li key={topic} className="flex items-center">
              <svg className="w-4 h-4 text-[#0134BD] mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              </svg>
              {topic}
            </li>
          ))}
        </ul>
      </div>
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
