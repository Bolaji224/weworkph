import React from 'react';

interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  onClick?: () => void;
  className?: string;
}

const RatingSummary: React.FC<RatingSummaryProps> = ({
  averageRating,
  totalReviews,
  onClick,
  className = '',
}) => {
  if (totalReviews === 0) {
    return (
      <span className={`text-xs text-gray-400 italic ${className}`}>
        No reviews yet
      </span>
    );
  }

  const content = (
    <>
      <span className="text-yellow-400 text-sm">★</span>
      <span className="font-semibold text-gray-800 text-sm">{averageRating.toFixed(1)}</span>
      <span className="text-gray-400 text-xs">({totalReviews})</span>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-1 hover:opacity-80 transition-opacity group ${className}`}
        title="View reviews"
      >
        {content}
        <span className="text-xs text-[#2aa100] underline-offset-2 group-hover:underline ml-0.5">
          reviews
        </span>
      </button>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {content}
    </span>
  );
};

export default RatingSummary;
