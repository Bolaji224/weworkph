import React, { useState, useEffect, useRef } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { UilEye, UilShare } from "@iconscout/react-unicons";
import {
  httpGetWithToken,
  httpPostWithToken,
} from "../../../../utils/http_utils";
import { useNavigate } from "react-router-dom";
import { Button, useToast } from "@chakra-ui/react";

const JobAlertTable: React.FC = () => {
  const [jobAlerts, setJobAlerts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [action, setAction] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [shareEmail, setShareEmail] = useState<string>("");
  const [shareLoading, setShareLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const navigate = useNavigate();

  const itemsPerPage = 5;
  const totalPages = Math.ceil(jobAlerts.length / itemsPerPage);

  // ✅ Fetch jobs correctly
  const getJobAlert = async () => {
    try {
      const res = await httpGetWithToken("jobs-alert");
      console.log("Fetched Job Alerts:", res);

      const jobs = res?.data?.data || res?.data || [];
      if (Array.isArray(jobs)) {
        setJobAlerts(jobs);
      } else {
        setJobAlerts([]);
      }
    } catch (err) {
      console.error("Error fetching job alerts:", err);
      setJobAlerts([]);
    }
  };

  useEffect(() => {
    getJobAlert();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleActionClick = (alert: any, actionType: string) => {
    setSelectedAlert(alert);
    setAction(actionType);
    setShowDropdown(null);
  };

  const shareJob = async () => {
    if (!selectedAlert?.id || !shareEmail) return;
    setShareLoading(true);
    const resp = await httpPostWithToken(`job/share/${selectedAlert.id}`, {
      to: shareEmail,
    });
    setShareLoading(false);

    if (resp.status === "success") {
      toast({
        status: "success",
        title: resp.message || "Job shared successfully",
        isClosable: true,
      });
    } else {
      toast({
        status: "error",
        title: resp.message || "Failed to share job",
        isClosable: true,
      });
    }
    setSelectedAlert(null);
    setAction(null);
  };

  const displayAlerts = jobAlerts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="mt-[8rem] px-[2.5rem]">
      <section className="flex flex-col md:flex-row gap-4 md:gap-12 justify-between items-center">
        <h2 className="text-green-700 text-2xl sm:text-3xl md:text-4xl font-poppins font-semibold">
          Job Alerts
        </h2>
      </section>

      <div className="max-w-full mx-auto p-4 mt-4 bg-white shadow-md rounded-xl">
        <div className="overflow-x-auto p-4">
          <table className="min-w-full bg-white rounded-[20px]">
            <thead className="bg-pink-100 rounded-xl mt-2">
              <tr className="text-green-700 font-poppins font-medium">
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Company</th>
                <th className="py-2 px-4 text-left">Work Type</th>
                <th className="py-2 px-4 text-left">Job Type</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayAlerts.length > 0 ? (
                displayAlerts.map((alert, index) => (
                  <tr key={index} className="text-left border-b">
                    <td className="py-4 px-4 text-green-900 font-sans font-semibold">
                      {alert?.title || "Untitled Job"}
                    </td>

                    <td className="py-8 px-4 text-green-700">
                      {alert?.company?.name || "Unknown Company"}
                      <p className="text-gray-800">
                        {alert?.location || "No Location"}
                      </p>
                    </td>

                    <td className="py-8 px-4 text-gray-800">
                      {alert?.work_type?.title || "N/A"}
                    </td>

                    <td className="py-8 px-4 text-gray-800">
                      {alert?.job_type?.title || "N/A"}
                    </td>

                    <td className="py-8 px-4 text-gray-800 relative">
                      <button onClick={() => setShowDropdown(index)}>
                        <BiDotsVerticalRounded size={25} color="#ABB2B9" />
                      </button>

                      {showDropdown === index && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 mt-2 w-36 z-20 bg-white border rounded shadow-lg"
                        >
                          <button
                            onClick={() => handleActionClick(alert, "View")}
                            className="w-full flex items-center gap-2 text-left text-gray-600 font-poppins px-4 py-2 hover:bg-gray-200"
                          >
                            <UilEye size="18" /> View
                          </button>
                          <button
                            onClick={() => handleActionClick(alert, "Share")}
                            className="w-full flex items-center gap-2 text-left text-gray-600 font-poppins px-4 py-2 hover:bg-gray-200"
                          >
                            <UilShare size="18" /> Share
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-600">
                    No job alerts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-30">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
              {action === "View" && (
                <>
                  <h3 className="text-xl font-semibold mb-4 text-green-600">
                    {selectedAlert?.title || "Untitled Job"}
                  </h3>
                  <p className="text-gray-700">
                    <strong>Company:</strong>{" "}
                    {selectedAlert?.company?.name || "Unknown"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Description</strong>{" "}
                    {selectedAlert?.description || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Requirement</strong>{" "}
                    {selectedAlert?.requirements || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Salary:</strong> {selectedAlert?.salary || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Location:</strong>{" "}
                    {selectedAlert?.location || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Experience:</strong>{" "}
                    {selectedAlert?.experience || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Job Type:</strong>{" "}
                    {selectedAlert?.job_type?.title || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Work Type:</strong>{" "}
                    {selectedAlert?.work_type?.title || "N/A"}
                  </p>
                  <div className="text-gray-700">
                    <strong>Skills: </strong>
                    {selectedAlert?.skills &&
                    selectedAlert.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedAlert.skills.map(
                          (skill: string, index: number) => (
                            <span
                              key={index}
                              className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-800"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </div>

                  <p className="text-gray-700">
                    <strong>Budget</strong> {selectedAlert?.budget || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Date Posted:</strong>{" "}
                    {selectedAlert?.date_posted || "N/A"}
                  </p>
                </>
              )}

              {action === "Share" && (
                <div className="flex flex-col gap-4">
                  <input
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    type="email"
                    className="border p-2 rounded-md flex-grow"
                    placeholder="Enter email address"
                  />
                  <Button
                    onClick={shareJob}
                    isLoading={shareLoading}
                    bg={"green"}
                    color={"white"}
                    px={4}
                    py={2}
                    rounded={"md"}
                  >
                    Send
                  </Button>
                </div>
              )}

              {action === "Apply" && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData();
                    formData.append("cv", (e.target as any).cv.files[0]);
                    formData.append(
                      "experience_years",
                      (e.target as any).experience_years.value
                    );
                    formData.append("reason", (e.target as any).reason.value);

                    const res = await httpPostWithToken(
                      `apply-job/${selectedAlert.id}`,
                      formData
                    );

                    if (res.status === "success") {
                      toast({
                        status: "success",
                        title: "Job application submitted successfully!",
                      });
                      setSelectedAlert(null);
                    } else {
                      toast({
                        status: "error",
                        title: res.message || "Failed to apply for job",
                      });
                    }
                  }}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Upload CV
                    </label>
                    <input
                      type="file"
                      name="cv"
                      accept=".pdf,.doc,.docx"
                      className="border p-2 w-full rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="experience_years"
                      min="0"
                      className="border p-2 w-full rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Why do you qualify?
                    </label>
                    <textarea name="reason" rows={4} className="border p-2 w-full rounded-md" placeholder="Explain briefly why you are a good fit......." required />
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button type="submit" bg="green" color="white" px={4} py={2} rounded="md">
                      Submit Application
                    </Button>

                    <Button onClick={() => setAction("View")} bg="gray.500" color="white" px={4} py={2} rounded="md">
                      Cancle
                    </Button>
                  </div>
                </form>
              )}

              <div className="mt-4 flex justify-end gap-2">
                {action === "View" && (
                  <Button
                    onClick={() => setAction("Apply")}
                    bg={"green"}
                    color={"white"}
                    px={4}
                    py={2}
                    rounded={"md"}
                  >
                    Apply
                  </Button>
                )}
                <Button
                  onClick={() => setSelectedAlert(null)}
                  bg={"gray.500"}
                  color={"white"}
                  px={4}
                  py={2}
                  rounded={"md"}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <ul className="flex list-none">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className="mx-1">
                <button
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-full ${
                    currentPage === page
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default JobAlertTable;
