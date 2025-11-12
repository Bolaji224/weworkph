import React, { useEffect, useState } from "react";
import { httpGetWithToken, httpPostWithToken } from "../../../utils/http_utils";
import { useToast } from "@chakra-ui/react";
import { PaystackButton } from "react-paystack";
import {
  Star,
  MapPin,
  Briefcase,
  DollarSign,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

// ✅ Simple Modal Component
const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-gray-800"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

const BrowseCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState("Free Users"); // Dropdown selection
  const toast = useToast();

  // ✅ Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<any>(null);
  const [messageText, setMessageText] = useState("");

  const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY!;
  const amount = 3000 * 100; // ₦3,000 (Paystack expects amount in kobo)

  const fetchCandidates = async () => {
    try {
      const res = await httpGetWithToken("employer/browse-candidates");

      if (res.data.payment_required) {
        setHasPaid(false);
        setCandidates([]);
      } else {
        setCandidates(res.data || []);
        setHasPaid(true);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast({
        status: "error",
        title: "Failed to fetch candidates",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSuccess = async (ref: any) => {
    try {
      await httpPostWithToken("employer/record-payment", {
        reference: ref.reference,
        amount: amount / 100,
        status: "success",
      });
      toast({
        status: "success",
        title: "Payment successful! Access granted.",
      });
      fetchCandidates();
    } catch {
      toast({
        status: "error",
        title: "Error saving payment record.",
      });
    }
  };

  const handleClose = () => {
    toast({
      status: "info",
      title: "Payment closed. Please try again.",
    });
  };

  // ✅ Open modal when Message button is clicked
  const handleOpenModal = (candidate: any) => {
    setSelectedApplicantId(candidate);
    setModalVisible(true);
  };

  // ✅ Handle sending message (frontend only — integrate backend if needed)
  const messageApplicant = (id: any) => {
    console.log("Message sent to:", id, messageText);
    toast({
      status: "success",
      title: `Message sent to ${selectedApplicantId?.first_name || "candidate"}`,
    });
    setMessageText("");
    setModalVisible(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen py-[8rem]">
      {/* Header */}
      <header className="mb-8 border-b pb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Browse Candidates
          </h1>
          <p className="text-gray-600 text-sm flex items-center gap-2">
            Find and connect with top-rated professionals
          </p>
        </div>

        {/* Dropdown */}
        <div className="relative mt-3 md:mt-0">
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="appearance-none border border-gray-300 text-gray-700 text-sm rounded px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option>Free Users</option>
            <option>SmartStart Users</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-2 top-3 text-gray-500 pointer-events-none"
          />
        </div>
      </header>

      {/* Payment Wall */}
      {!hasPaid ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Access Restricted
          </h2>
          <p className="text-gray-600 mb-4">
            Pay ₦3,000 to unlock the full candidate list.
          </p>
          <PaystackButton
            text="Pay with Paystack"
            amount={amount}
            publicKey={publicKey}
            email="employer@example.com"
            onSuccess={handleSuccess}
            onClose={handleClose}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-all"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(candidates) && candidates.length > 0 ? (
            candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={candidate.avatar || "/default-avatar.png"}
                    alt={candidate.name}
                    className="w-14 h-14 rounded-full object-cover border mr-4"
                  />
                  <div>
                    <h2 className="font-semibold text-gray-800 text-lg">
                      {candidate.first_name || candidate.name || "Unnamed"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {candidate.experience || "Candidate"}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center text-yellow-500 text-sm mb-3">
                  <Star size={16} className="fill-yellow-400 mr-1" />
                  <span>{candidate.rating || "4.8"}</span>
                  <span className="text-gray-500 ml-1">
                    ({candidate.review_count || "23"} reviews)
                  </span>
                </div>

                {/* Details */}
                <div className="text-sm text-gray-600 space-y-1 mb-3">
                  <p className="flex items-center gap-2">
                    <MapPin size={14} /> {candidate.city || "Unknown"},{" "}
                    {candidate.country || ""}
                  </p>
                  <p className="flex items-center gap-2">
                    <DollarSign size={14} />{" "}
                    {candidate.expected_salary
                      ? `₦${candidate.expected_salary}/hr`
                      : "Rate not set"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Briefcase size={14} /> {candidate.completed_jobs || 0} Jobs
                    Completed
                  </p>
                </div>

                {/* Skills */}
                {candidate.skills && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {candidate.skills
                      .split(",")
                      .slice(0, 5)
                      .map((skill: string, i: number) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                  </div>
                )}

                {/* Bio */}
                {candidate.bio && (
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {candidate.bio}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => window.open(candidate.cv || "#", "_blank")}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleOpenModal(candidate)}
                    className="flex items-center bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition"
                  >
                    <MessageSquare size={14} className="mr-1" /> Message
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 col-span-3 text-center">
              No candidates found.
            </p>
          )}
        </div>
      )}

      {/* ✅ Message Modal */}
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        title={`Send Message to ${selectedApplicantId?.first_name || ""}`}
      >
        <div className="relative">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full border p-3 rounded-lg focus:ring focus:ring-green-100"
            rows={4}
            placeholder="Type your message here..."
          />
          <button
            onClick={() =>
              selectedApplicantId && messageApplicant(selectedApplicantId.id)
            }
            className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Send Message
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BrowseCandidates;
