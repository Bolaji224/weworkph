import React, { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { httpGetWithToken } from './../../../../utils/http_utils';
import { UilBriefcaseAlt, UilMapMarker, UilCalendarAlt, UilBuilding } from '@iconscout/react-unicons';

const CandidateAppliedJobs: React.FC = () => {
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    setLoading(true);
    try {
      const res = await httpGetWithToken("candidate/applied-jobs");
      if (res.status === "success") {
        setAppliedJobs(res.data);
      } else {
        toast({
          status: "error",
          title: "Failed to fetch applied jobs.",
          description: res.message,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        status: "error",
        title: "Error fetching applied jobs.",
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ee009d] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your applied jobs...</p>
        </div>
      </div>
    );
  }

  if (appliedJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#FFF5F8] rounded-2xl p-8">
        <UilBriefcaseAlt className="text-gray-300 mb-4" size={80} />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Applied Jobs Yet</h3>
        <p className="text-gray-500 mb-6">Start exploring opportunities and apply to jobs that match your skills.</p>
        <Link
          to="/find-job"
          className="bg-[#ee009d] hover:bg-[#d1008a] text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
        >
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 mt-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">My Applied Jobs</h2>
          <p className="text-gray-600">Track your job applications and their status</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appliedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                    job.status
                  )}`}
                >
                  {job.status || "Pending"}
                </span>
                <div className="bg-[#FFF5F8] p-2 rounded-lg">
                  <UilBriefcaseAlt className="text-[#ee009d]" size={24} />
                </div>
              </div>

              {/* Job Title */}
              <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">
                {job.title}
              </h3>

              {/* Company Name */}
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <UilBuilding size={18} className="text-[#4ADE80]" />
                <span className="font-medium">{job.company?.name || "Company Name"}</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-500 mb-3">
                <UilMapMarker size={18} className="text-gray-400" />
                <span className="text-sm">{job.location || "Remote"}</span>
              </div>

              {/* Applied Date */}
              <div className="flex items-center gap-2 text-gray-500 mb-4">
                <UilCalendarAlt size={18} className="text-gray-400" />
                <span className="text-sm">
                  Applied on {new Date(job.date_applied).toLocaleDateString()}
                </span>
              </div>

              {/* View Job Button */}
              <Link
                to={`/job-details/${job.slug}`}
                className="block text-center bg-[#4ADE80] hover:bg-[#2AA100] text-white font-semibold py-2.5 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                View Job Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateAppliedJobs;