import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { httpGetWithToken } from "../../../utils/http_utils";
import FreelancerReviewSection from "../../reviews/FreelancerReviewSection";
import LeaveReviewModal from "../../reviews/LeaveReviewModal";
import RatingSummary from "../../reviews/RatingSummary";
import ReviewsModal from "../../reviews/ReviewsModal";

const CandidateProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const initialApplicant = location.state?.applicant || null;

  const [applicant, setApplicant] = useState<any>(initialApplicant);
  const [loading, setLoading] = useState(!initialApplicant);
  const [error, setError] = useState<string | null>(null);

  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [leaveReviewOpen, setLeaveReviewOpen] = useState(false);
  const [reviewStats, setReviewStats] = useState<{
    averageRating: number;
    totalReviews: number;
    canReview: boolean;
  }>({
    averageRating: initialApplicant?.review_avg ?? 0,
    totalReviews: initialApplicant?.review_count ?? 0,
    canReview: initialApplicant?.can_review ?? false,
  });

  useEffect(() => {
    if (applicant) return;

    const fetchApplicant = async () => {
      setLoading(true);
      try {
        const response = await httpGetWithToken(`employer/applications/${id}`);
        if (response?.data) {
          const data = response.data;
          setApplicant(data);
          setReviewStats({
            averageRating: data.review_avg ?? 0,
            totalReviews: data.review_count ?? 0,
            canReview: data.can_review ?? false,
          });
        } else {
          setError("Applicant not found.");
        }
      } catch {
        setError("Failed to fetch applicant data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchApplicant();
    else { setError("Invalid applicant ID."); setLoading(false); }
  }, [id, applicant]);

  const handleReviewSuccess = () => {
    setReviewStats((prev) => ({ ...prev, canReview: false }));
    // Re-fetch to get updated counts
    if (id) {
      httpGetWithToken(`employer/applications/${id}`).then((res) => {
        if (res?.data) {
          setReviewStats({
            averageRating: res.data.review_avg ?? 0,
            totalReviews: res.data.review_count ?? 0,
            canReview: false,
          });
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="mt-12 p-6 min-h-screen py-[8rem] flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-2 border-gray-200 border-t-[#2aa100] rounded-full animate-spin" />
      </div>
    );
  }
  if (error) return <div className="mt-12 p-6 text-red-500">{error}</div>;
  if (!applicant) return <div className="mt-12 p-6 text-gray-500">No applicant data available.</div>;

  const user = applicant.user || {};
  const job = applicant.job || {};
  const skills = user.skills ? user.skills.split(",").map((s: string) => s.trim()) : [];

  return (
    <div className="mt-12 p-6 bg-gray-50 min-h-screen py-[8rem] max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Applicant Profile</h1>
      </header>

      {/* Profile Hero */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-5">
        <div className="flex items-start gap-5 flex-wrap">
          {user.avatar ? (
            <img
              src={`${process.env.REACT_APP_API_URL}/${user.avatar}`}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ee009d] to-[#2aa100] flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {(user.first_name || user.name || "?").charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900">{user.name || user.first_name}</h2>

              {/* SkillStamp badge */}
              {user.skillstamps?.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full">
                  🏅 {user.skillstamps[0].name}
                </span>
              )}

              {/* Top Rated badge */}
              {reviewStats.averageRating >= 4.5 && reviewStats.totalReviews >= 5 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-green-50 text-green-700 border border-green-100 rounded-full">
                  🏆 Top Rated
                </span>
              )}
            </div>

            <p className="text-gray-500 text-sm mt-1">{user.bio || ""}</p>

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {user.city && (
                <span className="text-xs text-gray-400">📍 {user.city}{user.country ? `, ${user.country}` : ""}</span>
              )}
              {user.expected_salary && (
                <span className="text-xs text-gray-400">💰 ${user.expected_salary}/hr</span>
              )}
            </div>

            {/* Rating summary */}
            <div className="mt-3 flex items-center gap-3">
              <RatingSummary
                averageRating={reviewStats.averageRating}
                totalReviews={reviewStats.totalReviews}
                onClick={reviewStats.totalReviews > 0 ? () => setReviewsOpen(true) : undefined}
              />

              {reviewStats.canReview && (
                <button
                  onClick={() => setLeaveReviewOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full hover:bg-yellow-100 transition"
                >
                  ✍️ Leave a Review
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-5">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Application Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Applied for</p>
            <p className="font-medium text-gray-800">{job.title || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Status</p>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                applicant.status === "approved"
                  ? "bg-green-50 text-green-700"
                  : applicant.status === "rejected"
                  ? "bg-red-50 text-red-600"
                  : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {applicant.status || "Pending"}
            </span>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Experience</p>
            <p className="font-medium text-gray-800">
              {applicant.experience_years}{" "}
              {applicant.experience_years === 1 ? "year" : "years"}
            </p>
          </div>
          {applicant.cv && (
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">CV</p>
              <a
                href={applicant.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2aa100] text-sm font-medium hover:underline"
              >
                View CV →
              </a>
            </div>
          )}
        </div>

        {applicant.reason && (
          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1.5">
              Why they applied
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">{applicant.reason}</p>
          </div>
        )}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-5">
          <h3 className="text-base font-semibold text-gray-700 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 text-sm bg-[#F5E2EF] text-[#2aa100] rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {user.id && <FreelancerReviewSection freelancerId={user.id} />}

      {/* Modals */}
      <ReviewsModal
        isOpen={reviewsOpen}
        freelancerId={user.id}
        freelancerName={user.name || "Freelancer"}
        onClose={() => setReviewsOpen(false)}
      />

      <LeaveReviewModal
        isOpen={leaveReviewOpen}
        freelancerId={user.id}
        freelancerName={user.name || "Freelancer"}
        jobId={applicant.job_id ?? null}
        jobTitle={job.title ?? null}
        onClose={() => setLeaveReviewOpen(false)}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
};

export default CandidateProfile;
