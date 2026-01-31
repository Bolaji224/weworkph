import React, { useState, useEffect } from 'react';
import { httpPostWithToken, httpGetWithToken } from '../../../../utils/http_utils';
import { X, AlertCircle, CheckCircle, Banknote } from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

interface WithdrawalBalance {
  wallet_balance: number;
  approved_balance: number;
  withdrawn_or_pending: number;
  available_for_withdrawal: number;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
}) => {
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);
  const [balanceInfo, setBalanceInfo] = useState<WithdrawalBalance | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchAvailableBalance();
    }
  }, [isOpen]);

  const fetchAvailableBalance = async () => {
    setLoadingBalance(true);
    try {
      const response = await httpGetWithToken('candidate/withdrawal-balance');
      if (response) {
        setBalanceInfo(response);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!amount || parseFloat(amount) < 500) {
      setError('Minimum withdrawal amount is ₦500');
      return;
    }

    if (!balanceInfo) {
      setError('Unable to load balance information');
      return;
    }

    const availableAmount = balanceInfo.available_for_withdrawal || 0;

    if (parseFloat(amount) > availableAmount) {
      setError(`You can only withdraw ₦${availableAmount.toLocaleString()} from employer-approved work`);
      return;
    }

    if (!bankName || !accountNumber || !accountName) {
      setError('Please fill in all bank details');
      return;
    }

    if (accountNumber.length !== 10) {
      setError('Account number must be exactly 10 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await httpPostWithToken('candidate/withdrawals', {
        amount: parseFloat(amount),
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName,
      });

      if (response?.status === 'success') {
        alert(`✓ Withdrawal request submitted!\nReference: ${response.data.reference}\nAmount: ₦${parseFloat(amount).toLocaleString()}\n\nYour request is pending admin approval.`);
        onSuccess();
        handleClose();
      } else {
        setError(response?.error || 'Failed to submit withdrawal request');
      }
    } catch (error: any) {
      console.error('Error submitting withdrawal:', error);
      
      if (error?.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error?.response?.data?.data?.message) {
        setError(error.response.data.data.message);
      } else {
        setError('Failed to submit withdrawal request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setBankName('');
    setAccountNumber('');
    setAccountName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const nigerianBanks = [
    'Access Bank',
    'Citibank Nigeria',
    'Ecobank Nigeria',
    'Fidelity Bank',
    'First Bank of Nigeria',
    'First City Monument Bank (FCMB)',
    'Guaranty Trust Bank (GTBank)',
    'Heritage Bank',
    'Keystone Bank',
    'Polaris Bank',
    'Providus Bank',
    'Stanbic IBTC Bank',
    'Standard Chartered Bank',
    'Sterling Bank',
    'Union Bank of Nigeria',
    'United Bank for Africa (UBA)',
    'Unity Bank',
    'Wema Bank',
    'Zenith Bank',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Banknote className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Withdraw Funds</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Balance Info */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-b border-gray-200">
          {loadingBalance ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <p className="mt-2 text-sm text-gray-600">Loading balance...</p>
            </div>
          ) : balanceInfo ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Wallet Balance:</span>
                <span className="text-lg font-semibold text-gray-900">
                  ₦{(balanceInfo.wallet_balance || 0).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Approved by Employers:</span>
                <span className="text-lg font-semibold text-green-600">
                  ₦{(balanceInfo.approved_balance || 0).toLocaleString()}
                </span>
              </div>

              {(balanceInfo.withdrawn_or_pending || 0) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending Withdrawal:</span>
                  <span className="text-sm font-medium text-amber-600">
                    -₦{(balanceInfo.withdrawn_or_pending || 0).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Available to Withdraw:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₦{(balanceInfo.available_for_withdrawal || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {(balanceInfo.available_for_withdrawal || 0) === 0 && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      No funds available for withdrawal. Wait for employers to approve your completed work.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">Unable to load balance information</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="500"
              max={balanceInfo?.available_for_withdrawal || 0}
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!balanceInfo || (balanceInfo.available_for_withdrawal || 0) === 0}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Minimum: ₦500 | Maximum: ₦{(balanceInfo?.available_for_withdrawal || 0).toLocaleString()}
            </p>
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!balanceInfo || balanceInfo.available_for_withdrawal === 0}
              required
            >
              <option value="">Select your bank</option>
              {nigerianBanks.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                  setAccountNumber(value);
                }
              }}
              placeholder="0123456789"
              maxLength={10}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!balanceInfo || balanceInfo.available_for_withdrawal === 0}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Must be exactly 10 digits
            </p>
          </div>

          {/* Account Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Name
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Full name as registered with bank"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!balanceInfo || balanceInfo.available_for_withdrawal === 0}
              required
            />
          </div>

          {/* Info Box */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Important:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Withdrawal requests are processed within 24-48 hours</li>
                  <li>Ensure bank details are correct to avoid delays</li>
                  <li>You can only withdraw from employer-approved work</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:bg-gray-100 font-medium text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !balanceInfo || (balanceInfo.available_for_withdrawal || 0) === 0}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </span>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawalModal;