import React from 'react';

export interface PlayerCardProps {
  name: string;
  position: string;
  gradYear: number;
  location: string;
  tags: string[];
  image: string;
  onViewProfile?: () => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  position,
  gradYear,
  location,
  tags,
  image,
  onViewProfile,
}) => {
  return (
    <article className="bg-navy-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={image}
            alt={name}
            className="w-16 h-16 rounded-full mr-4 object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold text-white">{name}</h3>
            <p className="text-slate-400">{position} &bull; Class of {gradYear}</p>
          </div>
        </div>
        <p className="text-slate-400 mb-3">{location}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#0134BD] text-white px-2 py-1 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        {onViewProfile && (
          <button
            onClick={onViewProfile}
            className="w-full bg-[#FB6C1D] hover:bg-[#e55a1a] text-white py-2 px-4 rounded-md font-semibold transition-colors"
          >
            View Profile
          </button>
        )}
      </div>
    </article>
  );
};
