import React, { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { httpGetWithToken } from './../../../../utils/http_utils';

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
      const res = await httpGetWithToken("candidate/applied-jobs"); // call API
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

  if (loading) return <p>Loading your applied jobs...</p>;
  if (appliedJobs.length === 0) return <p>You have not applied to any jobs yet.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Applied Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appliedJobs.map((job) => (
          <div key={job.id} className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <p className="text-gray-600">{job.company?.name}</p>
            <p className="text-gray-500">{job.location || "Remote"}</p>
            <p className="text-sm mt-1">
              Status:{" "}
              <span
                className={
                  job.status === "approved"
                    ? "text-green-600"
                    : job.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }
              >
                {job.status}
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Applied on: {new Date(job.date_applied).toLocaleDateString()}
            </p>
            <Link
              to={`/job-details/${job.slug}`}
              className="mt-2 inline-block text-green-700 font-medium hover:underline"
            >
              View Job
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateAppliedJobs;
