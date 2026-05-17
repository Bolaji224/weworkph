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

interface ReviewsModalProps {
  freelancerId: number;
  freelancerName: string;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewsModal: React.FC<ReviewsModalProps> = ({
  freelancerId,
  freelancerName,
  isOpen,
  onClose,
}) => {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && freelancerId) {
      setStats(null);
      setLoading(true);
      httpGetWithToken(`reviews/freelancer/${freelancerId}`)
        .then((res) => { if (res?.data) setStats(res.data); })
        .finally(() => setLoading(false));
    }
  }, [isOpen, freelancerId]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Client Reviews</h2>
            <p className="text-sm text-gray-400 mt-0.5">{freelancerName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition text-lg"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {loading && (
            <div className="py-16 text-center">
              <div className="inline-block w-8 h-8 border-2 border-gray-200 border-t-yellow-400 rounded-full animate-spin" />
              <p className="mt-3 text-sm text-gray-400">Loading reviews…</p>
            </div>
          )}

          {!loading && (!stats || stats.total_reviews === 0) && (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">⭐</div>
              <p className="text-gray-700 font-medium">No reviews yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Reviews appear after a project is completed.
              </p>
            </div>
          )}

          {!loading && stats && stats.total_reviews > 0 && (
            <>
              {/* Rating Overview */}
              <div className="flex items-start gap-6 mb-7 p-5 bg-gray-50 rounded-xl">
                <div className="text-center shrink-0">
                  <div className="text-5xl font-bold text-gray-900 leading-none">
                    {stats.average_rating.toFixed(1)}
                  </div>
                  <div className="mt-1.5">
                    <StarDisplay rating={stats.average_rating} size="md" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {stats.total_reviews} review{stats.total_reviews !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = stats.breakdown[star]?.percentage ?? 0;
                    const count = stats.breakdown[star]?.count ?? 0;
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

              {/* Review Cards */}
              <div className="space-y-4">
                {stats.reviews.map((review) => (
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
                          <p className="text-sm font-semibold text-gray-800 leading-tight">
                            {review.client_name}
                          </p>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;
