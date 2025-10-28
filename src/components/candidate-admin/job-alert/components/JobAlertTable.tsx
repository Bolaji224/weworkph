import React, { useEffect, useState } from "react";
import { httpGetWithToken, httpPostWithToken } from "../../../../utils/http_utils";
import { Button, useToast } from "@chakra-ui/react";
import { UilEye, UilShareAlt } from "@iconscout/react-unicons";

const JobAlertTable: React.FC = () => {
  const [jobAlerts, setJobAlerts] = useState<any[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [action, setAction] = useState<"View" | "Apply" | "Share" | null>(null);
  const toast = useToast();

  const [appliedJobs, setAppliedJobs] = useState<number[]>(() => {
    const saved = localStorage.getItem("appliedJobs");
    return saved ? JSON.parse(saved) : [];
  });

  const [justAppliedJobs, setJustAppliedJobs] = useState<number[]>([]);

  const getJobAlert = async () => {
    try {
      const res = await httpGetWithToken("jobs-alert");
      const jobs = res?.data?.data || res?.data || [];

      const filteredJobs = jobs.filter(
        (job: any) => !appliedJobs.includes(job.id)
      );

      setJobAlerts(Array.isArray(filteredJobs) ? filteredJobs : []);
    } catch (err) {
      console.error(err);
      setJobAlerts([]);
    }
  };

  useEffect(() => {
    getJobAlert();
  }, []);

  const handleApplySuccess = (jobId: number) => {
    setJustAppliedJobs((prev) => [...prev, jobId]);

    const updated = [...appliedJobs, jobId];
    setAppliedJobs(updated);
    localStorage.setItem("appliedJobs", JSON.stringify(updated));

    setJobAlerts((prev) => prev.filter((job) => job.id !== jobId));
  };

  return (
    <section className="mt-12 px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-green-700 mb-6">
        Job Alerts
      </h2>

      <div className="space-y-6">
        {jobAlerts.length > 0 ? (
          jobAlerts.map((job, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 mt-12"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">
                    Posted {job.posted || "recently"}
                  </p>
                  <h3 className="text-xl font-semibold text-gray-800 mt-1">
                    {job.title || "Untitled Job"}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {job.company?.name || "Unknown Company"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {job.type || "Full-time"} •{" "}
                    {job.level || "Intermediate"} •{" "}
                    {job.duration || "6+ months"}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedAlert(job);
                      setAction("Apply");
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                  >
                    Apply
                  </button>

                  <button
                    onClick={() => {
                      setSelectedAlert(job);
                      setAction("Share");
                    }}
                    className="border border-green-600 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition flex items-center gap-1"
                  >
                    <UilShareAlt size={16} />
                    Share
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mt-3 leading-relaxed line-clamp-3">
                {job.description ||
                  "No job description available. Please check later."}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mt-3">
                {job.skills && job.skills.length > 0 ? (
                  job.skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500">No skills listed</span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    ⭐ {job.rating || "5.0"}
                  </span>
                  <span>${job.salary || "N/A"} spent</span>
                  <span>{job.location || "Remote"}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedAlert(job);
                    setAction("View");
                  }}
                  className="text-green-700 font-medium hover:underline flex items-center gap-1"
                >
                  <UilEye size={16} /> View
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No job alerts available.</p>
        )}
      </div>

      {/* Modal (reuses your existing modal logic) */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-40 px-4">
          <div className="bg-white p-6 rounded-xl max-w-lg w-full shadow-lg relative">
            <button
              onClick={() => {
                setSelectedAlert(null);
                setAction(null);
              }}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
            >
              ✕
            </button>

            {action === "View" && (
              <>
                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  {selectedAlert.title}
                </h3>
                <p className="text-gray-700 text-sm mb-2">
                  {selectedAlert.description}
                </p>
              </>
            )}

            {action === "Share" && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-green-600">
                  Share this Job
                </h3>
                <input
                  type="email"
                  placeholder="Enter email to share"
                  className="w-full border rounded-md p-2 mb-4"
                />
                <Button colorScheme="green" w="full">
                  Send Invite
                </Button>
              </div>
            )}

            {action === "Apply" && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-green-600">
                  Apply for {selectedAlert.title}
                </h3>
                <form
  className="flex flex-col gap-3"
  onSubmit={async (e) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const cvFile = (form.querySelector('input[type="file"]') as HTMLInputElement)
      ?.files?.[0];
    const reason = (form.querySelector('textarea') as HTMLTextAreaElement)?.value;

    if (!cvFile || !reason) {
      toast({
        status: "error",
        title: "Please upload your CV and provide a reason.",
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("cv", cvFile);
    formData.append("experience_years", "0"); // optional if you don't have that field in UI
    formData.append("reason", reason);

    try {
      const res = await httpPostWithToken(
        `apply-job/${selectedAlert.id}`,
        formData
      );
      console.log("Response:", res);

      if (res.status === "success") {
        toast({
          status: "success",
          title: "Application submitted successfully!",
        });

        handleApplySuccess(selectedAlert.id);
        setSelectedAlert(null); // closes modal
      } else {
        toast({
          status: "error",
          title: res.message || "Failed to submit application",

        });
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        status: "error",
        title: "Something went wrong. Please try again.",
      });
    }
  }}
>
  <input
    type="file"
    name="cv"
    className="border p-2 rounded-md"
    accept=".pdf,.doc,.docx"
    required
  />
  <textarea
    name="reason"
    placeholder="Why are you a good fit?"
    className="border p-2 rounded-md"
    rows={4}
    required
  />
  <Button colorScheme="green" w="full" type="submit">
    Submit Application
  </Button>
</form>

              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default JobAlertTable;
