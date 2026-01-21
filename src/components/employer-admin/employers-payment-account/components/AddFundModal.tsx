import React, { useState } from 'react';
import { paystackConfig } from "../../../../utils/PaystackConfig";
import { httpPostWithToken } from '../../../../utils/http_utils';
import { iProfileCompany } from '../../../../models/profle';
import { useToast } from '@chakra-ui/react';
import { PaystackHookExample } from './paystack';

interface AddFundsModalProps {
  onClose: () => void;
  paymentDone: () => void;
  profile: iProfileCompany;
}

const AddFundsModal: React.FC<AddFundsModalProps> = ({ onClose, profile, paymentDone }) => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const [mode, setMode] = useState<"idle" | "choose" | "escrow" | "milestone">("idle");
  const [steps, setSteps] = useState<{ title: string; percent: number | "" }[]>([
  { title: "", percent: "" },
]);

  const [userId, setUserId] = useState("");

  const toast = useToast();

  const [config, setconfig] = useState<any>({
    ...paystackConfig,
    amount: amount * 100,
    email: profile?.email || "",
    reference: "",
  });

  const handleEscrow = async () => {
    if (loading) return;

    if (amount < 100) {
      return toast({
        status: "error",
        title: "Amount must be NGN100 and above",
        isClosable: true,
        duration: 5000,
      });
    }

    setLoading(true);

    const response = await httpPostWithToken("employer/fund-wallet", {
      amount,
      type: "escrow",
    });

    if (response.status === "success") {
      setconfig({
        ...paystackConfig,
        amount: amount * 100,
        email: profile?.email || "",
        reference: response.data.reference,
      });
      setShowPayment(true);
    } else {
      toast({
        status: "error",
        title: response.error || response.message,
      });
    }

    setLoading(false);
  };

  const handleMilestoneSubmit = async () => {
    const total = steps.reduce(
  (a, b) => a + (b.percent === "" ? 0 : b.percent),
  0
);


    if (total !== 100) {
      return toast({
        status: "error",
        title: "Milestones must total 100%",
      });
    }

    if (!userId) {
      return toast({
        status: "error",
        title: "User ID is required",
      });
    }

    const response = await httpPostWithToken("employer/create-milestones", {
      amount,
      user_id: userId,
      steps,
    });

    if (response.status === "success") {
      setconfig({
        ...paystackConfig,
        amount: amount * 100,
        email: profile?.email || "",
        reference: response.data.reference,
      });
      setShowPayment(true);
    } else {
      toast({
        status: "error",
        title: response.error || response.message,
      });
    }
  };

  if (!profile) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {showPayment ? (
          <>
            <PaystackHookExample
              amount={amount}
              close={() => setShowPayment(false)}
              config={config}
              success={() => paymentDone()}
            />

            <button
              onClick={onClose}
              className="text-red-700 font-bold py-2 px-4 rounded w-full mt-3"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Add Funds</h2>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              placeholder="Enter amount"
              className="w-full border rounded-lg p-2 mb-4"
            />

            {mode === "idle" && (
              <button
                onClick={() => setMode("choose")}
                className="bg-[#2AA100] text-white py-2 px-4 rounded w-full mb-2"
              >
                Add Funds
              </button>
            )}

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
                      Fund your wallet with a single lump-sum payment.
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
              </div>
            )}

            {mode === "escrow" && (
              <button
                onClick={handleEscrow}
                className="bg-[#2AA100] text-white py-2 px-4 rounded w-full"
              >
                Continue to Payment
              </button>
            )}
{mode === "milestone" && (
  <div className="space-y-4">
    <div className="bg-gray-50 border rounded-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-1">Milestone Breakdown</h3>
      <p className="text-sm text-gray-500 mb-3">
        Define each phase of the job and how much (%) of the total payment it gets.
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
            placeholder="Milestone title (e.g. Design, Development)"
            value={s.title}
            onChange={(e) => {
              const copy = [...steps];
              copy[i].title = e.target.value;
              setSteps(copy);
            }}
            className="flex-1 border-0 focus:ring-0 outline-none text-sm"
          />

          <div className="flex items-center gap-1">
        <input
  type="number"
  placeholder="0"
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
        onClick={() => setSteps([...steps, { title: "", percent: 0 }])}
        className="text-sm text-blue-600 hover:underline mt-2"
      >
        + Add another milestone
      </button>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Freelancer / User ID
      </label>
      <input
        placeholder="Enter the user ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="w-full border rounded-lg p-2"
      />
    </div>

    <button
      onClick={handleMilestoneSubmit}
      className="bg-[#2AA100] text-white py-2 px-4 rounded w-full"
    >
      Continue to Payment
    </button>
  </div>
)}
    </>
          )}
      </div>
    </div>
  );
};

export default AddFundsModal;
