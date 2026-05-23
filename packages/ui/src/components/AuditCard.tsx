import React from 'react';

export interface AuditCardProps {
  title: string;
  description: string;
  label: string;
  actionLabel?: string;
  onAction?: () => void;
}

const labelColors: Record<string, string> = {
  Popular: 'bg-[#0134BD]',
  Coaching: 'bg-[#FB6C1D]',
  NIL: 'bg-[#C8A24A]',
};

export const AuditCard: React.FC<AuditCardProps> = ({
  title,
  description,
  label,
  actionLabel = 'Book Audit',
  onAction,
}) => {
  const labelColor = labelColors[label] || 'bg-[#0134BD]';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <span className={`${labelColor} text-white px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider`}>
          {label}
        </span>
      </div>
      <h2 className="text-xl font-semibold text-[#121B47] mb-2">{title}</h2>
      <p className="text-gray-500 mb-6">{description}</p>
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
