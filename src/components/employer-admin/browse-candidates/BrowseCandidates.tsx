import React, { useEffect, useState } from "react";
import { httpGetWithToken, httpPostWithToken } from "../../../utils/http_utils";
import { useToast } from "@chakra-ui/react";
import { PaystackButton } from "react-paystack";
import ApplicantCard from "../all-applicates/components/AllApplicantCard";

const BrowseCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true); // Start as loading
  const toast = useToast();

  const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY!;
  const amount = 3000 * 100; // ₦3,000 (Paystack expects amount in kobo)

  // Fetch candidate list
  const fetchCandidates = async () => {
    try {
      const res = await httpGetWithToken("employer/browse-candidates");
      console.log("Fetched candidates:", res.data);
      console.log("Setting candidates state to:", res.data.data);
      console.log("Candidates state after setting:", candidates);


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

  // Handle Paystack success
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
      fetchCandidates(); // Re-fetch candidates
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

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen py-[8rem]">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Browse All Candidates
      </h1>

      {/* Payment Gate */}
      {!hasPaid ? (
        <div className="bg-white p-6 rounded shadow-md text-center">
          <h2 className="text-lg font-semibold mb-2">Access Restricted</h2>
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
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.isArray(candidates) && candidates.length > 0 ? (
            candidates.map((candidate) => (
              <ApplicantCard
                key={candidate.id}
                name={candidate.first_name || candidate.name || "Unnamed"}
                role="Candidate"
                location={candidate.country || "Not specified"}
                rate={0}
                skills={["No skills provided"]}
                profileImage={"/default-avatar.png"}
                status=""
                onView={() => {}}
                onDelete={() => {}}
                onApprove={() => {}}
                onReject={() => {}}
                onMessage={() => {}}
              />
            ))
          ) : (
            <p className="text-gray-600 col-span-2 text-center">
              No candidates found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BrowseCandidates;
