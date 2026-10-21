import React from 'react';
import { Star } from 'lucide-react';

/**
 * StarRating component
 * Renders 5 stars with fractional gold fill, optional numeric score,
 * and optional review count.
 */
export default function StarRating({
  rating = 4.8,
  reviewsCount = null,
  size = 'sm',
  showScore = false,
  showCount = false,
  countFormat = 'parens', // 'parens' => (74), 'full' => (74 reviews), 'text' => 74 reviews
  scoreClass = '',
  countClass = '',
  className = '',
  interactive = false,
  onRate = null,
}) {
  const numRating = Number(rating) || 4.8;
  const clampedRating = Math.max(1, Math.min(5, numRating));

  // Determine size classes
  const starSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };
  const starSizeClass = starSizes[size] || size;

  // Format reviews count text
  let countText = null;
  if (showCount && reviewsCount != null) {
    if (countFormat === 'parens') {
      countText = `(${reviewsCount})`;
    } else if (countFormat === 'full') {
      countText = `(${reviewsCount} reviews)`;
    } else {
      countText = `${reviewsCount} reviews`;
    }
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* 5-star cluster */}
      <div className="inline-flex items-center gap-0.5 text-[#FFD700]">
        {[0, 1, 2, 3, 4].map((i) => {
          const fillFraction = Math.max(0, Math.min(1, clampedRating - i));
          const fillPercent = Math.round(fillFraction * 100);

          if (interactive) {
            const isFilled = i + 1 <= clampedRating;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onRate && onRate(i + 1)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <Star
                  className={`${starSizeClass} ${
                    isFilled ? 'fill-[#FFD700] text-[#FFD700]' : 'text-stone-300 fill-stone-100'
                  }`}
                  strokeWidth={0.5}
                />
              </button>
            );
          }

          return (
            <div key={i} className="relative inline-flex items-center justify-center shrink-0">
              {/* Background empty star */}
              <Star
                className={`${starSizeClass} text-stone-200 fill-stone-200`}
                strokeWidth={0}
              />
              {/* Foreground filled gold star (fractional clip) */}
              {fillPercent > 0 && (
                <div
                  className="absolute top-0 left-0 overflow-hidden h-full pointer-events-none"
                  style={{ width: `${fillPercent}%` }}
                >
                  <Star
                    className={`${starSizeClass} text-[#FFD700] fill-[#FFD700]`}
                    strokeWidth={0}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Numeric Score e.g. 4.8 */}
      {showScore && (
        <span className={`font-bold text-stone-800 ${scoreClass || 'text-xs'}`}>
          {clampedRating.toFixed(1)}
        </span>
      )}

      {/* Reviews Count e.g. (74) */}
      {countText && (
        <span className={`text-stone-400 font-normal ${countClass || 'text-[11px]'}`}>
          {countText}
        </span>
      )}
    </div>
  );
}
