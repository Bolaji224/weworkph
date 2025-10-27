import React, { useEffect, useState } from "react";
import { httpGetWithToken } from "../../../utils/http_utils";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ApprovedCandidatesPage: React.FC = () => {
  const [approved, setApproved] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApproved();
  }, []);

  const fetchApproved = async () => {
    setLoading(true);
    try {
      const response = await httpGetWithToken("employer/applications");
      const approvedOnly = response.data.filter(
        (a: any) => a.status === "approved"
      );
      setApproved(approvedOnly);
    } catch (error) {
      console.error("Error fetching approved applicants:", error);
      toast({
        status: "error",
        title: "Failed to load approved candidates.",
        isClosable: true,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen py-[8rem]">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Approved Candidates
          </h1>
          <p className="text-gray-600">
            Candidates you’ve approved for your job postings.
          </p>
        </div>
        <button
          onClick={() => navigate("/employer/applicants")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Back to All Applicants
        </button>
      </header>

      {approved.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          No approved candidates yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {approved.map((a) => (
            <div
              key={a.id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={
                    a.user?.avatar
                      ? `${process.env.REACT_APP_API_URL}/${a.user.avatar}`
                      : "/default-avatar.png"
                  }
                  alt={a.user?.name || "Candidate"}
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-gray-800 text-lg">
                    {a.user?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500">{a.job?.title}</p>
                  <p className="text-sm text-gray-500">
                    {a.job?.location || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() =>
                    navigate(`/candidate-profile/${a.user?.id}`)
                  }
                  className="text-blue-600 hover:underline"
                >
                  View Profile
                </button>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Approved
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedCandidatesPage;
