import React, { useEffect, useState } from 'react';
import { httpGetWithToken, httpPostWithToken } from '../../../../utils/http_utils';
import { useToast } from '@chakra-ui/react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Payment {
  id: number;
  candidate_id: number;
  amount: number;
  type: 'escrow' | 'milestone';
  status: 'pending' | 'completed' | 'failed';
  work_status: 'pending' | 'approved' | 'rejected';
  reference: string;
  payment_method: string;
  paid_at: string | null;
  created_at: string;
  work_approved_at: string | null;
  employer_note: string | null;
  candidate?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  milestones?: Array<{
    id: number;
    title: string;
    percentage: number;
    amount: number;
    status: string;
  }>;
}

interface PaginatedResponse {
  data: Payment[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

const PaymentsHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [filterType, setFilterType] = useState<'all' | 'escrow' | 'milestone'>('all');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [rejectModal, setRejectModal] = useState<{ show: boolean; payment: Payment | null; reason: string }>({
    show: false,
    payment: null,
    reason: '',
  });
  const toast = useToast();

  useEffect(() => {
    fetchPayments(currentPage);
  }, [currentPage, filterStatus, filterType]);

  const fetchPayments = async (page: number) => {
    setLoading(true);
    try {
      const response = await httpGetWithToken(
        `employer/payments?page=${page}&status=${filterStatus}&type=${filterType}`
      );

      if (response?.data) {
        const paginatedData = response as PaginatedResponse;
        setPayments(paginatedData.data);
        setCurrentPage(paginatedData.current_page);
        setLastPage(paginatedData.last_page);
        setTotalPayments(paginatedData.total);
      } else {
        toast({
          status: 'error',
          title: 'Error loading payments',
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        status: 'error',
        title: 'Failed to load payment history',
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveWork = async (payment: Payment) => {
    if (!window.confirm(`Approve work completed by ${payment.candidate?.first_name} ${payment.candidate?.last_name}?\n\nThis will allow them to withdraw ₦${payment.amount.toLocaleString()}`)) {
      return;
    }

    setProcessingId(payment.id);
    try {
      const response = await httpPostWithToken('employer/approve-work', {
        payment_id: payment.id,
      });

      if (response?.status === 'success') {
        toast({
          status: 'success',
          title: 'Work Approved!',
          description: 'Candidate can now withdraw funds.',
          isClosable: true,
        });
        fetchPayments(currentPage); // Refresh list
      } else {
        toast({
          status: 'error',
          title: response?.error || 'Failed to approve work',
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error('Error approving work:', error);
      toast({
        status: 'error',
        title: error?.response?.data?.error || 'Failed to approve work',
        isClosable: true,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectWork = async () => {
    if (!rejectModal.payment || !rejectModal.reason.trim()) {
      toast({
        status: 'error',
        title: 'Please provide a reason for rejection',
        isClosable: true,
      });
      return;
    }

    setProcessingId(rejectModal.payment.id);
    try {
      const response = await httpPostWithToken('employer/reject-work', {
        payment_id: rejectModal.payment.id,
        reason: rejectModal.reason,
      });

      if (response?.status === 'success') {
        toast({
          status: 'success',
          title: 'Work Rejected',
          description: 'Candidate has been notified.',
          isClosable: true,
        });
        setRejectModal({ show: false, payment: null, reason: '' });
        fetchPayments(currentPage); // Refresh list
      } else {
        toast({
          status: 'error',
          title: response?.error || 'Failed to reject work',
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error('Error rejecting work:', error);
      toast({
        status: 'error',
        title: error?.response?.data?.error || 'Failed to reject work',
        isClosable: true,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkStatusBadge = (workStatus: string) => {
    switch (workStatus) {
      case 'approved':
        return { color: 'bg-green-100 text-green-800', text: 'Work Approved' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', text: 'Work Rejected' };
      default:
        return { color: 'bg-amber-100 text-amber-800', text: 'Pending Review' };
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'escrow':
        return 'bg-blue-100 text-blue-800';
      case 'milestone':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Payments History</h2>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as any);
              setCurrentPage(1);
            }}
            className="w-full border rounded-lg p-2"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Type
          </label>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value as any);
              setCurrentPage(1);
            }}
            className="w-full border rounded-lg p-2"
          >
            <option value="all">All Types</option>
            <option value="escrow">Escrow</option>
            <option value="milestone">Milestone</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">
          Total Payments: <strong className="text-lg text-gray-900">{totalPayments}</strong>
        </p>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading payments...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No payments found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                  Candidate
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                  Payment Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                  Work Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => {
                const workStatusBadge = getWorkStatusBadge(payment.work_status || 'pending');
                return (
                  <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.candidate?.first_name} {payment.candidate?.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{payment.candidate?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">
                        ₦{payment.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(
                          payment.type
                        )}`}
                      >
                        {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          payment.status
                        )}`}
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${workStatusBadge.color}`}
                      >
                        {workStatusBadge.text}
                      </span>
                      {payment.employer_note && (
                        <p className="text-xs text-gray-500 mt-1">Note: {payment.employer_note}</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-600">{formatDate(payment.created_at)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {payment.status === 'completed' && payment.work_status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApproveWork(payment)}
                              disabled={processingId === payment.id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded text-xs font-medium transition-colors"
                              title="Approve completed work"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectModal({ show: true, payment, reason: '' })}
                              disabled={processingId === payment.id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded text-xs font-medium transition-colors"
                              title="Reject work"
                            >
                              <XCircle className="w-3 h-3" />
                              Reject
                            </button>
                          </>
                        ) : payment.work_status === 'approved' ? (
                          <span className="text-xs text-green-600 font-medium">✓ Approved</span>
                        ) : payment.work_status === 'rejected' ? (
                          <span className="text-xs text-red-600 font-medium">✗ Rejected</span>
                        ) : payment.status !== 'completed' ? (
                          <span className="text-xs text-gray-500">Awaiting payment</span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {lastPage}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
              const page = currentPage + i - 2;
              return page > 0 && page <= lastPage ? (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 border rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ) : null;
            })}

            <button
              onClick={() => setCurrentPage(Math.min(lastPage, currentPage + 1))}
              disabled={currentPage === lastPage}
              className="px-4 py-2 border rounded-lg disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.show && rejectModal.payment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Reject Work</h3>
              </div>

              <p className="text-gray-600 mb-4">
                Rejecting work from <strong>{rejectModal.payment.candidate?.first_name} {rejectModal.payment.candidate?.last_name}</strong>
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for rejection (required)
                </label>
                <textarea
                  value={rejectModal.reason}
                  onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                  placeholder="Please explain why the work is being rejected..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{rejectModal.reason.length}/500 characters</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setRejectModal({ show: false, payment: null, reason: '' })}
                  disabled={processingId === rejectModal.payment.id}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:bg-gray-100 font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectWork}
                  disabled={processingId === rejectModal.payment.id || !rejectModal.reason.trim()}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium"
                >
                  {processingId === rejectModal.payment.id ? 'Processing...' : 'Reject Work'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsHistory;