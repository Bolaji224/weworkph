import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApplicantCard from "./AllApplicantCard";
import { httpGetWithToken, httpPostWithToken } from "../../../../utils/http_utils";
import { useToast } from "@chakra-ui/react";
import Modal from "./Modal";
import { useNotifications } from "../../NotificationContext";
import ReviewsModal from "../../../reviews/ReviewsModal";
import LeaveReviewModal from "../../../reviews/LeaveReviewModal";

const ApplicantsPage: React.FC = () => {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<any[]>([]);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedApplicantId, setSelectedApplicantId] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Review modal state
  const [reviewsModal, setReviewsModal] = useState<{
    open: boolean;
    freelancerId: number;
    freelancerName: string;
  }>({ open: false, freelancerId: 0, freelancerName: "" });

  const [leaveReviewModal, setLeaveReviewModal] = useState<{
    open: boolean;
    freelancerId: number;
    freelancerName: string;
    jobId: number | null;
    jobTitle: string | null;
  }>({ open: false, freelancerId: 0, freelancerName: "", jobId: null, jobTitle: null });

  const { slug: jobSlug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { refreshNotifications } = useNotifications();

  useEffect(() => {
    fetchJobData();
  }, [jobSlug]);

  useEffect(() => {
    filterApplicants();
  }, [searchTerm, statusFilter, applicants]);

  const fetchJobData = async () => {
    setLoading(true);
    try {
      const response = await httpGetWithToken("employer/applications");
      setApplicants(response.data || []);
      setJobDetails(response.data?.[0]?.job || null);
    } catch (error) {
      toast({
        status: "error",
        title: "Failed to load applications.",
        isClosable: true,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const filterApplicants = () => {
    let filtered = applicants;
    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.user?.skills?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }
    setFilteredApplicants(filtered);
  };

  const approveApplicant = async (id: number) => {
    if (loading) return;
    setLoading(true);
    try {
      await httpPostWithToken(`employer/applications/${id}/update-status`, { status: "approved" });
      setApplicants((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "approved", can_review: true } : a))
      );
      refreshNotifications();
      toast({ status: "success", title: "Applicant approved successfully!", isClosable: true, duration: 3000 });
    } catch {
      toast({ status: "error", title: "Failed to approve applicant.", isClosable: true, duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const rejectApplicant = async (id: number) => {
    if (loading) return;
    setLoading(true);
    try {
      await httpPostWithToken(`employer/applications/${id}/update-status`, { status: "rejected" });
      fetchJobData();
      refreshNotifications();
      toast({ status: "success", title: "Applicant rejected.", isClosable: true, duration: 5000 });
    } catch {
      toast({ status: "error", title: "Failed to reject applicant.", isClosable: true, duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const messageApplicant = async (id: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const payload = { receiver_id: id, message: messageText };
      const res = await httpPostWithToken("chat/send-chat", payload);
      const chatId = res?.data?.id ?? res?.data?.chat_id ?? null;
      toast({ status: "success", title: "Message sent successfully!", isClosable: true, duration: 5000 });
      navigate(chatId ? "/employers-messages" : "/employers-messages", {
        state: chatId ? { chatId } : undefined,
      });
    } catch {
      toast({ status: "error", title: "Failed to send message.", isClosable: true, duration: 5000 });
    } finally {
      setLoading(false);
      setModalVisible(false);
      setMessageText("");
    }
  };

  const handleReviewSuccess = (applicantUserId: number) => {
    setApplicants((prev) =>
      prev.map((a) =>
        a.user?.id === applicantUserId ? { ...a, can_review: false } : a
      )
    );
    toast({ status: "success", title: "Review submitted!", isClosable: true, duration: 4000 });
    // Refresh to get updated review stats
    fetchJobData();
  };

  if (!jobDetails && loading) {
    return <div className="p-6 text-center text-gray-600">Loading applications…</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen py-[8rem]">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Applicants</h1>
        {jobDetails && <p className="text-gray-500 text-sm">{jobDetails.title}</p>}
      </header>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search applicants…"
            className="border rounded-lg px-3 py-2 w-full md:w-64 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="submitted">Pending</option>
          </select>
        </div>
        <div className="text-sm text-gray-700 flex gap-4">
          <span><strong>Total:</strong> {applicants.length}</span>
          <span className="text-green-600">
            <strong>Approved:</strong> {applicants.filter((a) => a.status === "approved").length}
          </span>
          <span className="text-red-600">
            <strong>Rejected:</strong> {applicants.filter((a) => a.status === "rejected").length}
          </span>
        </div>
      </div>

      {/* Applicant Cards */}
      {filteredApplicants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredApplicants.map((applicant, index) => (
            <ApplicantCard
              key={applicant.id}
              userId={applicant.user?.id}
              name={applicant.user?.name || "Unknown"}
              role={applicant.job?.title || "No job title"}
              location={applicant.job?.location || "Not specified"}
              rate={applicant.job?.salary || 0}
              skills={
                applicant.user?.skills
                  ? applicant.user.skills.split(",").map((s: string) => s.trim())
                  : ["N/A"]
              }
              skillstamp={applicant.user?.skillstamps?.[0]?.name ?? null}
              profileImage={
                applicant.user?.avatar
                  ? `${process.env.REACT_APP_API_URL}/${applicant.user.avatar}`
                  : "/default-avatar.png"
              }
              status={applicant.status}
              averageRating={applicant.review_avg ?? 0}
              totalReviews={applicant.review_count ?? 0}
              canReview={applicant.can_review ?? false}
              onDelete={() => setApplicants((prev) => prev.filter((_, i) => i !== index))}
              onApprove={() => approveApplicant(applicant.id)}
              onReject={() => rejectApplicant(applicant.id)}
              onView={() =>
                navigate(`/candidate-profile/${applicant.user?.id}`, { state: { applicant } })
              }
              onMessage={() => {
                setSelectedApplicantId(applicant.user);
                setModalVisible(true);
              }}
              onViewReviews={() =>
                setReviewsModal({
                  open: true,
                  freelancerId: applicant.user?.id,
                  freelancerName: applicant.user?.name || "Freelancer",
                })
              }
              onLeaveReview={() =>
                setLeaveReviewModal({
                  open: true,
                  freelancerId: applicant.user?.id,
                  freelancerName: applicant.user?.name || "Freelancer",
                  jobId: applicant.job_id ?? null,
                  jobTitle: applicant.job?.title ?? null,
                })
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500">No applicants found.</p>
        </div>
      )}

      {/* Message Modal */}
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        title={`Send Message to ${selectedApplicantId?.name || ""}`}
      >
        <div className="relative">
          <button
            onClick={() => setModalVisible(false)}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          >
            <span className="text-2xl">×</span>
          </button>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full border p-3 rounded-lg focus:ring focus:ring-blue-100"
            rows={4}
            placeholder="Type your message here…"
          />
          <button
            onClick={() => selectedApplicantId && messageApplicant(selectedApplicantId.id)}
            className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Send Message
          </button>
        </div>
      </Modal>

      {/* Reviews View Modal */}
      <ReviewsModal
        isOpen={reviewsModal.open}
        freelancerId={reviewsModal.freelancerId}
        freelancerName={reviewsModal.freelancerName}
        onClose={() => setReviewsModal((p) => ({ ...p, open: false }))}
      />

      {/* Leave Review Modal */}
      <LeaveReviewModal
        isOpen={leaveReviewModal.open}
        freelancerId={leaveReviewModal.freelancerId}
        freelancerName={leaveReviewModal.freelancerName}
        jobId={leaveReviewModal.jobId}
        jobTitle={leaveReviewModal.jobTitle}
        onClose={() => setLeaveReviewModal((p) => ({ ...p, open: false }))}
        onSuccess={() => handleReviewSuccess(leaveReviewModal.freelancerId)}
      />
    </div>
  );
};

export default ApplicantsPage;
