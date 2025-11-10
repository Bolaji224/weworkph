import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { httpGetWithToken } from './../../../utils/http_utils';

const CandidateProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  
  // Try to get applicant from navigation state
  const initialApplicant = location.state?.applicant || null;

  const [applicant, setApplicant] = useState<any>(initialApplicant);
  const [loading, setLoading] = useState(!initialApplicant); // Only load if no state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we already have applicant from state, skip fetching
    if (applicant) return;

    const fetchApplicant = async () => {
      setLoading(true);
      try {
        const response = await httpGetWithToken(`employer/applications/${id}`);
        if (response?.data) {
          setApplicant(response.data);
        } else {
          setError("Applicant not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch applicant data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplicant();
    } else {
      setError("Invalid applicant ID.");
      setLoading(false);
    }
  }, [id, applicant]);

  if (loading) return <div>Loading applicant data...</div>;
  if (error) return <div>{error}</div>;
  if (!applicant) return <div>No applicant data available</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen py-[8rem]">
     <header className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800"> Applicant Information</h1>
      <p className="text-gray-600">{applicant.user?.first_name || "Unnamed Applicant"}</p>
      </header>

      <div className="bg-white p-4 rounded shadow">
        <p><strong>Job:</strong> {applicant.job?.title || "N/A"}</p>
        <p><strong>Experience:</strong> {applicant.experience_years} {applicant.experience_years === 1 ? "year" : "years"}</p>
        <p><strong>Reason for applying:</strong> {applicant.reason || "N/A"}</p>
        <p><strong>Status:</strong> {applicant.status || "N/A"}</p>
        {applicant.cv && (
          <p>
            <strong>CV:</strong>{" "}
            <a
              href={`${process.env.REACT_APP_API_URL}/${applicant.cv}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Download CV
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;
