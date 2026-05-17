import React from 'react';

interface StarDisplayProps {
  rating: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const StarDisplay: React.FC<StarDisplayProps> = ({ rating, size = 'md' }) => {
  const sizeClass = { xs: 'text-xs', sm: 'text-sm', md: 'text-base', lg: 'text-xl' }[size];

  return (
    <span className={`inline-flex gap-px ${sizeClass}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const partial = !filled && rating > star - 1;
        const pct = partial ? Math.round((rating - (star - 1)) * 100) : 0;

        if (partial) {
          return (
            <span key={star} className="relative inline-block text-gray-200">
              ★
              <span
                className="absolute inset-0 overflow-hidden text-yellow-400"
                style={{ width: `${pct}%` }}
              >
                ★
              </span>
            </span>
          );
        }

        return (
          <span key={star} className={filled ? 'text-yellow-400' : 'text-gray-200'}>
            ★
          </span>
        );
      })}
    </span>
  );
};

export default StarDisplay;
