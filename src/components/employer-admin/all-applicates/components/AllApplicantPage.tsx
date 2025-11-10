import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // For dynamic routing
import ApplicantCard from "./AllApplicantCard";
import { httpGetWithToken, httpPostWithToken } from "../../../../utils/http_utils";
import { useToast } from "@chakra-ui/react";
import Modal from "./Modal";

const ApplicantsPage: React.FC = () => {
  // const { jobSlug } = useParams<{ slug: string }>(); // Access dynamic job slug from the URL
  const [applicants, setApplicants] = useState<any[]>([]);
  const [jobDetails, setJobDetails] = useState<any>(null);
  // const [approvedCount, setApprovedCount] = useState(0);
  // const [rejectedCount, setRejectedCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedApplicantId, setSelectedApplicantId] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const param = useParams();
  const jobSlug = param.slug

  const navigate = useNavigate();

  const toast = useToast();

  // Fetch job and applicants data
  useEffect(() => {

    fetchJobData();
  }, [jobSlug]);

  const fetchJobData = async () => {
    setLoading(true);
    try {
      const response = await httpGetWithToken("employer/applications");
      console.log(response.data);
  
      setApplicants(response.data);
      if (response.data.length > 0) {
        setJobDetails(response.data[0].job); 
      }
    } catch (error) {
      console.error("Error fetching job applications:", error);
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
  

  // Approve an applicant
  const approveApplicant = async (id: number) => {
    if (loading) return;
    setLoading(true);
    try {
      await httpPostWithToken(`employer/applications/${id}/update-status`, {
        status: "approved"
      });

      setApplicants(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status: "approved" } : app
        )
      );
      
      toast({
        status: "success",
        title: "Applicant approved successfully!",
        isClosable: true,
        duration: 3000,
      });


    } catch (error) {
      console.error("Error approving applicant:", error);
      toast({
        status: "error",
        title: "Failed to approve applicant.",
        isClosable: true,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Reject an applicant
  const rejectApplicant = async (id: number) => {
    if (loading) return;
    setLoading(true);
    try {
      await httpPostWithToken(`employer/applications/${id}/update-status`, {
        status: "rejected"
      });
      fetchJobData()
      toast({
        status: "success",
        title: "Applicant rejected successfully!",
        isClosable: true,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error rejecting applicant:", error);
      toast({
        status: "error",
        title: "Failed to reject applicant.",
        isClosable: true,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Message an applicant
const messageApplicant = async (id: number) => {
  if (loading) return;
  setLoading(true);
  try {
    const payload = {
      receiver_id: id,
      message: messageText
    };
    const res = await httpPostWithToken("chat/send-chat", payload);
    // res.data is chat object (ChatResource) if backend matches
    const chatId = res?.data?.id ?? res?.data?.chat_id ?? null;
    toast({
      status: "success",
      title: "Message sent successfully!",
      isClosable: true,
      duration: 5000,
    });
    // Navigate to employer chat page and open the chat
    if (chatId) {
      navigate("/employers-messages", { state: { chatId } });
    } else {
      // just open chat list if chatId not returned
      navigate("/employers-messages");
    }
  } catch (error) {
    console.error("Error messaging applicant:", error);
    toast({
      status: "error",
      title: "Failed to send message.",
      isClosable: true,
      duration: 5000,
    });
  } finally {
    setLoading(false);
    setModalVisible(false);
  }
};


  if (!jobDetails) {
    return <div>Loading job details...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen py-[8rem]">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Applicants!</h1>
        <p className="text-gray-600">{jobDetails.title}</p>
      </header>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          {jobDetails.title}
        </h2>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
          <span>
            Total:{" "}
            <span className="font-bold text-gray-800">{applicants.length}</span>
          </span>
          <span>
            Approved:{" "}
            <span className="font-bold text-green-600">{applicants.filter(a => a.status === "approved").length}</span>
          </span>
          <span>
            Rejected:{" "}
            <span className="font-bold text-red-600">{applicants.filter(a => a.status === "rejected").length}</span>
          </span>
          {/* <span>
            Pending:{" "}
            <span className="font-bold text-yellow-300">{applicants.filter(a => a.status === "submitted").length}</span>
          </span> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {applicants.map((applicant, index) => (
  <ApplicantCard
    key={applicant.id}
    name={applicant.user?.name || "Unknown"}
    role={applicant.job?.title || "No job title"}
    location={applicant.job?.location || "Not specified"}
    rate={applicant.job?.salary || 0}
    skills={
      applicant.user?.skills
        ? applicant.user.skills.split(",").map((s: string) => s.trim())
        : ["N/A"]
    }
    profileImage={
      applicant.user?.avatar
        ? `${process.env.REACT_APP_API_URL}/${applicant.user.avatar}`
        : "/default-avatar.png"
    }
    status={applicant.status}
    onDelete={() => setApplicants((prev) => prev.filter((_, i) => i !== index))}
    onApprove={() => approveApplicant(applicant.id)}
    onReject={() => rejectApplicant(applicant.id)}
    onView={() => navigate(`/candidate-profile/${applicant.user?.id}`, { state: { applicant } })}
    onMessage={() => {
      setSelectedApplicantId(applicant.user);
      setModalVisible(true);
    }}
  />
))}

      </div>
        {/* Modal for messaging */}
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} title={`Send Message : ${selectedApplicantId?.name}`}>
        <div className="relative">
          {/* Close Icon */}
          <button
            onClick={() => setModalVisible(false)}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          >
            <span className="text-2xl">×</span>
          </button>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Type your message here..."
          />
          <button
            onClick={() => selectedApplicantId && messageApplicant(selectedApplicantId.id)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ApplicantsPage;
