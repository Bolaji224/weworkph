import React from 'react';
import {
  UilCheck,
  UilEye,
  UilTimes,
  UilEnvelopeCheck,
  UilCommentAltLines,
} from '@iconscout/react-unicons';
import RatingSummary from '../../../reviews/RatingSummary';

interface ApplicantCardProps {
  name: string;
  role: string;
  location: string;
  rate: number;
  profileImage: string;
  skills: string[];
  skillstamp?: string | null;
  userId: number;
  averageRating: number;
  totalReviews: number;
  canReview: boolean;
  onDelete: () => void;
  onApprove: () => void;
  onReject: () => void;
  onView: () => void;
  onMessage: () => void;
  onViewReviews: () => void;
  onLeaveReview: () => void;
  status?: string;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({
  name,
  role,
  location,
  rate,
  skills,
  profileImage,
  skillstamp,
  averageRating,
  totalReviews,
  canReview,
  onApprove,
  onReject,
  onView,
  onMessage,
  onViewReviews,
  onLeaveReview,
  status,
}) => {
  const normalizedStatus = (status || '').toLowerCase();

  const ActionButton = ({
    onClick,
    Icon,
    title,
    bgColor,
    hoverColor,
    textColor,
  }: {
    onClick: () => void;
    Icon: React.ElementType;
    title: string;
    bgColor: string;
    hoverColor: string;
    textColor: string;
  }) => (
    <button
      onClick={onClick}
      className={`p-[6px] ${bgColor} ${hoverColor} ${textColor} rounded-full transition-all`}
      title={title}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col sm:flex-row items-start gap-4 relative">
      {/* Profile Image */}
      <img
        src={profileImage}
        alt={`${name}'s profile`}
        className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 shrink-0"
      />

      {/* Info Block */}
      <div className="flex-1 w-full min-w-0">
        {/* Name row */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-gray-800 truncate">{name}</h3>

              {/* SkillStamp badge */}
              {skillstamp && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full">
                  🏅 {skillstamp}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm truncate">{role}</p>
            <p className="text-gray-400 text-xs truncate">{location}</p>
            <p className="mt-1 text-sm font-semibold text-gray-700">${rate}/hr</p>
          </div>

          {/* Status badge */}
          {normalizedStatus === 'approved' && (
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-100 shrink-0">
              <UilCheck size={12} /> Approved
            </span>
          )}
        </div>

        {/* Rating row */}
        <div className="mt-2 flex items-center gap-2">
          <RatingSummary
            averageRating={averageRating}
            totalReviews={totalReviews}
            onClick={totalReviews > 0 ? onViewReviews : undefined}
          />
          {totalReviews > 0 && (
            <button
              onClick={onViewReviews}
              className="text-xs text-[#2aa100] hover:underline font-medium"
            >
              View Reviews
            </button>
          )}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {skills.slice(0, 5).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs bg-[#F5E2EF] text-[#2aa100] rounded-full"
            >
              {skill}
            </span>
          ))}
          {skills.length > 5 && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">
              +{skills.length - 5}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3 justify-end flex-wrap items-center">
          {/* Leave review - only after approval */}
          {normalizedStatus === 'approved' && canReview && (
            <button
              onClick={onLeaveReview}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full hover:bg-yellow-100 transition"
            >
              <UilCommentAltLines size={13} />
              Leave Review
            </button>
          )}

          <ActionButton
            onClick={onView}
            Icon={UilEye}
            title="View Profile"
            bgColor="bg-[#F5E2EF]"
            hoverColor="hover:bg-green-200"
            textColor="text-[#2aa100]"
          />

          {normalizedStatus !== 'approved' && (
            <>
              <ActionButton
                onClick={onApprove}
                Icon={UilCheck}
                title="Approve"
                bgColor="bg-[#E8F5E9]"
                hoverColor="hover:bg-green-200"
                textColor="text-green-700"
              />
              <ActionButton
                onClick={onReject}
                Icon={UilTimes}
                title="Reject"
                bgColor="bg-[#FFEBEE]"
                hoverColor="hover:bg-red-200"
                textColor="text-red-600"
              />
            </>
          )}

          <ActionButton
            onClick={onMessage}
            Icon={UilEnvelopeCheck}
            title="Message"
            bgColor="bg-[#E3F2FD]"
            hoverColor="hover:bg-blue-200"
            textColor="text-blue-700"
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicantCard;
