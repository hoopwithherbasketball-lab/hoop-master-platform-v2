import React from 'react';

export interface StatItem {
  value: string;
  label: string;
  color?: string;
}

export interface StatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const columnMap: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  columns = 4,
  className = '',
}) => {
  return (
    <section className={`bg-[#121B47] text-white p-8 rounded-lg mb-12 ${className}`}>
      <div className={`grid gap-6 ${columnMap[columns] || 'md:grid-cols-4'} text-center`}>
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className={`text-3xl font-bold ${stat.color || 'text-[#C8A24A]'} mb-2`}>
              {stat.value}
            </div>
            <p className="text-gray-300">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
