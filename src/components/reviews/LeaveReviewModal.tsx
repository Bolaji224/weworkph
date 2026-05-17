import React, { useState } from 'react';
import { httpPostWithToken } from '../../utils/http_utils';

interface LeaveReviewModalProps {
  freelancerId: number;
  freelancerName: string;
  jobId?: number | null;
  jobTitle?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({
  freelancerId,
  freelancerName,
  jobId,
  jobTitle,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setRating(0);
    setHovered(0);
    setReview('');
    setError('');
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (rating === 0) { setError('Please select a star rating.'); return; }
    if (review.trim().length < 10) { setError('Review must be at least 10 characters.'); return; }

    setLoading(true);
    setError('');

    const res = await httpPostWithToken('employer/reviews', {
      freelancer_id: freelancerId,
      job_id: jobId ?? null,
      rating,
      review: review.trim(),
    });

    setLoading(false);

    if (res?.status === 'success') {
      reset();
      onSuccess();
      onClose();
    } else {
      setError(res?.message || res?.error || 'Something went wrong. Please try again.');
    }
  };

  if (!isOpen) return null;

  const activeStars = hovered || rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Leave a Review</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              For <span className="font-medium text-gray-700">{freelancerName}</span>
              {jobTitle && <span className="text-gray-400"> · {jobTitle}</span>}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition text-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Star Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Overall Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className={`text-4xl leading-none transition-transform duration-100 hover:scale-110 focus:outline-none ${
                    activeStars >= star ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                >
                  ★
                </button>
              ))}
              {activeStars > 0 && (
                <span className="ml-2 text-sm font-medium text-gray-600">
                  {LABELS[activeStars]}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review{' '}
              <span className="font-normal text-gray-400">(min. 10 characters)</span>
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="Share your experience working with this freelancer — quality of work, communication, and professionalism."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none transition focus:outline-none focus:ring-2 focus:ring-[#2aa100]/25 focus:border-[#2aa100]"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{review.length}/2000</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#2aa100] text-white rounded-xl text-sm font-semibold hover:bg-[#228c00] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting…' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveReviewModal;
