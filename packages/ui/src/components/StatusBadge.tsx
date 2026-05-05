import React from 'react';

export type BadgeStatus = 'active' | 'inactive' | 'pending' | 'completed' | 'error';

export interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;
  className?: string;
}

const statusColors: Record<BadgeStatus, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  error: 'bg-red-100 text-red-800'
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label = status.charAt(0).toUpperCase() + status.slice(1),
  className = ''
}) => {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]} ${className}`}
    >
      {label}
    </span>
  );
};
