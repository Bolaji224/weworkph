import React, { useEffect, useState } from 'react';
import { httpGetWithToken } from '../../utils/http_utils';
import StarDisplay from './StarDisplay';

interface Review {
  id: number;
  rating: number;
  review: string;
  created_at: string;
  client_name: string;
  client_avatar: string | null;
  job_title: string | null;
}

interface ReviewStats {
  reviews: Review[];
  average_rating: number;
  total_reviews: number;
  breakdown: Record<number, { count: number; percentage: number }>;
}

interface FreelancerReviewSectionProps {
  freelancerId: number;
}

const FreelancerReviewSection: React.FC<FreelancerReviewSectionProps> = ({ freelancerId }) => {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!freelancerId) return;
    setLoading(true);
    httpGetWithToken(`reviews/freelancer/${freelancerId}`)
      .then((res) => { if (res?.data) setStats(res.data); })
      .finally(() => setLoading(false));
  }, [freelancerId]);

  if (loading) {
    return (
      <section className="bg-white rounded-2xl p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Reviews</h2>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  const totalReviews = stats?.total_reviews ?? 0;
  const visibleReviews =
    stats && stats.reviews.length > 0
      ? expanded
        ? stats.reviews
        : stats.reviews.slice(0, 3)
      : [];

  return (
    <section className="bg-white rounded-2xl p-6 mt-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-800">Reviews</h2>
        {totalReviews > 0 && (
          <div className="flex items-center gap-1.5">
            <StarDisplay rating={stats!.average_rating} size="sm" />
            <span className="text-sm font-semibold text-gray-800">
              {stats!.average_rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-400">
              ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
            </span>
          </div>
        )}
      </div>

      {totalReviews === 0 && (
        <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
          <div className="text-3xl mb-2">⭐</div>
          <p className="text-gray-500 font-medium text-sm">No reviews yet</p>
          <p className="text-gray-400 text-xs mt-1">
            Reviews appear once a project has been completed.
          </p>
        </div>
      )}

      {totalReviews > 0 && (
        <>
          {/* Overview Bar */}
          <div className="flex items-start gap-6 mb-6 p-5 bg-gray-50 rounded-xl">
            <div className="text-center shrink-0">
              <div className="text-5xl font-bold text-gray-900 leading-none">
                {stats!.average_rating.toFixed(1)}
              </div>
              <div className="mt-1.5">
                <StarDisplay rating={stats!.average_rating} size="md" />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const pct = stats!.breakdown[star]?.percentage ?? 0;
                const count = stats!.breakdown[star]?.count ?? 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-3 text-right">{star}</span>
                    <span className="text-yellow-400 text-xs">★</span>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-5 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top-Rated badge */}
          {stats!.average_rating >= 4.5 && totalReviews >= 5 && (
            <div className="flex items-center gap-2 mb-5 px-4 py-3 bg-yellow-50 border border-yellow-100 rounded-xl">
              <span className="text-xl">🏆</span>
              <div>
                <p className="text-sm font-semibold text-yellow-800">Top Rated Freelancer</p>
                <p className="text-xs text-yellow-600">
                  Consistently praised by clients for exceptional work.
                </p>
              </div>
            </div>
          )}

          {/* Review Cards */}
          <div className="space-y-4">
            {visibleReviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    {review.client_avatar ? (
                      <img
                        src={review.client_avatar}
                        alt={review.client_name}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ee009d] to-[#2aa100] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {review.client_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{review.client_name}</p>
                      {review.job_title && (
                        <p className="text-xs text-gray-400 mt-0.5">{review.job_title}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StarDisplay rating={review.rating} size="xs" />
                    <span className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{review.review}</p>
              </div>
            ))}
          </div>

          {/* Show more/less */}
          {totalReviews > 3 && (
            <button
              onClick={() => setExpanded((p) => !p)}
              className="mt-4 w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              {expanded
                ? 'Show less'
                : `Show all ${totalReviews} reviews`}
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default FreelancerReviewSection;
