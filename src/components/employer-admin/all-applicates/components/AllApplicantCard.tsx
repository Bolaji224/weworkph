import React from 'react';
import { UilCheck, UilEye, UilTimes, UilTrashAlt, UilMessage, UilEnvelopeCheck } from '@iconscout/react-unicons';

interface ApplicantCardProps {
  name: string;
  role: string;
  location: string;
  rate: number;
  profileImage: string;
  skills: string[];
  onDelete: () => void;
  onApprove: () => void;
  onReject: () => void;
  onView: () => void;
  onMessage: () => void;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({
  name,
  role,
  location,
  rate,
  skills,
  profileImage,
  onDelete,
  onApprove,
  onReject,
  onView,
  onMessage,
}) => {
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
      className={`p-[4px] ${bgColor} ${hoverColor} ${textColor} rounded-[20px]`}
      title={title}
    >
      <Icon size={15} />
    </button>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow relative flex items-start gap-4">
      {/* Profile Image */}
      <img
        src={profileImage}
        alt={`${name}'s profile`}
        className="w-16 h-16 rounded-full object-cover border border-gray-300"
      />

      {/* Candidate Information */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <p className="text-gray-600 text-sm">{role}</p>
        <p className="text-gray-500 text-sm">{location}</p>
        <p className="mt-2 text-gray-800 font-medium">{rate}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-[#F5E2EF] text-[#2aa100] rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute top-4 right-4 flex gap-2">
        <ActionButton
          onClick={onView}
          Icon={UilEye}
          title="View"
          bgColor="bg-[#F5E2EF]"
          hoverColor="hover:bg-green-400"
          textColor="text-[#2aa100]"
        />
        <ActionButton
          onClick={onApprove}
          Icon={UilCheck}
          title="Approve"
          bgColor="bg-[#F5E2EF]"
          hoverColor="hover:bg-green-400"
          textColor="text-[#2aa100]"
        />
        <ActionButton
          onClick={onReject}
          Icon={UilTimes}
          title="Reject"
          bgColor="bg-[#F5E2EF]"
          hoverColor="hover:bg-green-400"
          textColor="text-[#2aa100]"
        />
        {/* <ActionButton
          onClick={onDelete}
          Icon={UilTrashAlt}
          title="Delete"
          bgColor="bg-[#F5E2EF]"
          hoverColor="hover:bg-green-400"
          textColor="text-[#2aa100]"
        /> */}
        <ActionButton
          onClick={onMessage}
          Icon={UilEnvelopeCheck}
          title="Message"
          bgColor="bg-[#F5E2EF]"
          hoverColor="hover:bg-green-400"
          textColor="text-[#2aa100]"
        />
      </div>
    </div>
  );
};

export default ApplicantCard;
