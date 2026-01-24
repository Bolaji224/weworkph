import React, { useState } from 'react';
import { httpPostWithToken } from '../../../../utils/http_utils';
import { iProfileCompany } from '../../../../models/profle';
import { useToast } from '@chakra-ui/react';
import PaystackPayment from './PaystackPayment';

interface AddFundsModalProps {
  onClose: () => void;
  paymentDone: () => void;
  profile: iProfileCompany;
}

const AddFundsModal: React.FC<AddFundsModalProps> = ({ onClose, profile, paymentDone }) => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [tokenValidating, setTokenValidating] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [candidateToken, setCandidateToken] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [paymentReference, setPaymentReference] = useState("");

  const [mode, setMode] = useState<"idle" | "choose" | "escrow" | "milestone">("idle");
  const [steps, setSteps] = useState<{ title: string; percent: number | "" }[]>([
    { title: "", percent: "" },
  ]);

  const [userId, setUserId] = useState("");
  const toast = useToast();

  // Validate candidate wallet token
  const validateToken = async () => {
    if (!candidateToken.trim()) {
      return toast({
        status: "error",
        title: "Please enter a token",
        isClosable: true,
      });
    }

    setTokenValidating(true);
    try {
      const response = await httpPostWithToken("employer/validate-token", {
        wallet_token: candidateToken,
      });

      if (response.status === "success") {
        setTokenValid(true);
        setCandidateName(response.candidate_name);
        setUserId(response.user_id.toString());
        toast({
          status: "success",
          title: `Token valid! Candidate: ${response.candidate_name}`,
          isClosable: true,
        });
      } else {
        setTokenValid(false);
        toast({
          status: "error",
          title: response.error || "Invalid token",
          isClosable: true,
        });
      }
    } catch (error) {
      setTokenValid(false);
      toast({
        status: "error",
        title: "Error validating token",
        isClosable: true,
      });
    } finally {
      setTokenValidating(false);
    }
  };

  // Handle escrow payment
  const handleEscrow = async () => {
    if (loading) return;

    if (!tokenValid) {
      return toast({
        status: "error",
        title: "Please validate token first",
        isClosable: true,
      });
    }

    if (amount < 100) {
      return toast({
        status: "error",
        title: "Amount must be NGN100 and above",
        isClosable: true,
        duration: 5000,
      });
    }

    setLoading(true);

    try {
      const response = await httpPostWithToken("employer/fund-wallet", {
        amount,
        type: "escrow",
        wallet_token: candidateToken,
        user_id: userId,
      });

      if (response.status === "success") {
        setPaymentId(response.data.payment_id);
        setPaymentReference(response.data.reference);
        setShowPayment(true);
      } else {
        toast({
          status: "error",
          title: response.error || response.message,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        status: "error",
        title: "Error creating payment",
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle milestone payment
  const handleMilestoneSubmit = async () => {
    const total = steps.reduce(
      (a, b) => a + (b.percent === "" ? 0 : b.percent),
      0
    );

    if (total !== 100) {
      return toast({
        status: "error",
        title: "Milestones must total exactly 100%",
        isClosable: true,
      });
    }

    if (!tokenValid) {
      return toast({
        status: "error",
        title: "Please validate token first",
        isClosable: true,
      });
    }

    if (amount < 100) {
      return toast({
        status: "error",
        title: "Amount must be NGN100 and above",
        isClosable: true,
      });
    }

    setLoading(true);

    try {
      const response = await httpPostWithToken("employer/create-milestones", {
        amount,
        user_id: userId,
        steps,
        wallet_token: candidateToken,
      });

      if (response.status === "success") {
        setPaymentId(response.data.payment_id);
        setPaymentReference(response.data.reference);
        setShowPayment(true);
      } else {
        toast({
          status: "error",
          title: response.error || response.message,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        status: "error",
        title: "Error creating milestones",
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {showPayment && paymentId ? (
          <>
            <PaystackPayment
              amount={amount}
              email={profile?.email || ""}
              reference={paymentReference}
              paymentId={paymentId}
              onSuccess={() => {
                setShowPayment(false);
                setPaymentId(null);
                paymentDone();
              }}
              onClose={() => {
                setShowPayment(false);
                setPaymentId(null);
              }}
            />

            <button
              onClick={onClose}
              className="text-gray-600 font-semibold py-2 px-4 rounded w-full mt-3 border"
            >
              Close Modal
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Add Funds to Candidate</h2>

            {/* Token Validation Section */}
            {mode === "idle" && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Step 1: Validate Candidate Token</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Enter the wallet token provided by the candidate to verify their identity.
                </p>

                <input
                  type="text"
                  value={candidateToken}
                  onChange={(e) => {
                    setCandidateToken(e.target.value);
                    setTokenValid(null);
                  }}
                  placeholder="Enter candidate wallet token (e.g., WT_...)"
                  className="w-full border rounded-lg p-2 mb-2 text-sm"
                />

                <button
                  onClick={validateToken}
                  disabled={tokenValidating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded mb-3"
                >
                  {tokenValidating ? "Validating..." : "Validate Token"}
                </button>

                {tokenValid === true && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded mb-3">
                    <p className="text-sm text-green-800">
                      ✓ Token valid! Candidate: <strong>{candidateName}</strong>
                    </p>
                  </div>
                )}

                {tokenValid === false && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded mb-3">
                    <p className="text-sm text-red-800">
                      ✗ Invalid token. Please check and try again.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Amount Input */}
            {tokenValid && mode === "idle" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (NGN)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  placeholder="Enter amount"
                  className="w-full border rounded-lg p-2 mb-4"
                />

                <button
                  onClick={() => setMode("choose")}
                  className="bg-[#2AA100] text-white py-2 px-4 rounded w-full"
                >
                  Next: Choose Payment Type
                </button>
              </div>
            )}

            {/* Payment Type Selection */}
            {mode === "choose" && (
              <div className="space-y-4">
                <div
                  onClick={() => setMode("escrow")}
                  className="cursor-pointer border rounded-lg p-4 flex items-start gap-3 hover:border-[#2AA100] hover:bg-green-50 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-[#2AA100] text-white flex items-center justify-center font-bold">
                    ₦
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">Escrow Payment</h3>
                    <p className="text-sm text-gray-500">
                      Fund the candidate wallet with a single lump-sum payment.
                    </p>
                  </div>
                  <span className="text-[#2AA100] font-medium text-sm">Select</span>
                </div>

                <div
                  onClick={() => setMode("milestone")}
                  className="cursor-pointer border rounded-lg p-4 flex items-start gap-3 hover:border-blue-600 hover:bg-blue-50 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    %
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">Milestone Payment</h3>
                    <p className="text-sm text-gray-500">
                      Split payment into stages and release funds gradually.
                    </p>
                  </div>
                  <span className="text-blue-600 font-medium text-sm">Select</span>
                </div>

                <button
                  onClick={() => setMode("idle")}
                  className="w-full text-gray-600 py-2 px-4 rounded border"
                >
                  Back
                </button>
              </div>
            )}

            {/* Escrow Confirmation */}
            {mode === "escrow" && (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">
                    Amount: <strong className="text-lg">₦{amount.toLocaleString()}</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    To: <strong>{candidateName}</strong>
                  </p>
                </div>

                <button
                  onClick={handleEscrow}
                  disabled={loading}
                  className="bg-[#2AA100] hover:bg-[#25920a] disabled:bg-gray-400 text-white py-2 px-4 rounded w-full font-semibold"
                >
                  {loading ? "Processing..." : "Continue to Payment"}
                </button>

                <button
                  onClick={() => setMode("choose")}
                  className="w-full text-gray-600 py-2 px-4 rounded border"
                >
                  Back
                </button>
              </div>
            )}

            {/* Milestone Breakdown */}
            {mode === "milestone" && (
              <div className="space-y-4">
                <div className="bg-gray-50 border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">Milestone Breakdown</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Define each phase and how much (%) of the total payment it gets.
                  </p>

                  {steps.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 mb-2 bg-white border rounded-lg p-2"
                    >
                      <span className="text-xs font-semibold text-gray-400 w-6">
                        {i + 1}.
                      </span>

                      <input
                        placeholder="Milestone title"
                        value={s.title}
                        onChange={(e) => {
                          const copy = [...steps];
                          copy[i].title = e.target.value;
                          setSteps(copy);
                        }}
                        className="flex-1 border-0 focus:ring-0 outline-none text-sm px-2"
                      />

                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          placeholder="0"
                          min="0"
                          max="100"
                          value={s.percent}
                          onChange={(e) => {
                            const copy = [...steps];
                            const val = e.target.value;
                            copy[i].percent = val === "" ? "" : Number(val);
                            setSteps(copy);
                          }}
                          className="w-16 text-right border rounded p-1 text-sm"
                        />
                        <span className="text-xs text-gray-400">%</span>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setSteps([...steps, { title: "", percent: "" }])}
                    className="text-sm text-blue-600 hover:underline mt-2"
                  >
                    + Add another milestone
                  </button>
                </div>

                <button
                  onClick={handleMilestoneSubmit}
                  disabled={loading}
                  className="bg-[#2AA100] hover:bg-[#25920a] disabled:bg-gray-400 text-white py-2 px-4 rounded w-full font-semibold"
                >
                  {loading ? "Processing..." : "Continue to Payment"}
                </button>

                <button
                  onClick={() => setMode("choose")}
                  className="w-full text-gray-600 py-2 px-4 rounded border"
                >
                  Back
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full text-gray-600 py-2 px-4 rounded border mt-4"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddFundsModal;