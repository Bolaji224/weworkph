import React, { useEffect, useState } from 'react';
import { httpGetWithToken } from '../../../../utils/http_utils';
import { useToast } from '@chakra-ui/react';

interface Payment {
  id: number;
  candidate_id: number;
  amount: number;
  type: 'escrow' | 'milestone';
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  payment_method: string;
  paid_at: string | null;
  created_at: string;
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {payment.candidate?.first_name} {payment.candidate?.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{payment.candidate?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">
                      ₦{payment.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeBadgeColor(
                        payment.type
                      )}`}
                    >
                      {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                        payment.status
                      )}`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono text-gray-600">{payment.reference}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{formatDate(payment.created_at)}</p>
                  </td>
                  <td className="px-6 py-4">
                    {payment.type === 'milestone' && (
                      <button
                        onClick={() => {
                          // Show milestone details modal
                          alert(
                            `Milestones:\n${payment.milestones
                              ?.map((m) => `${m.title}: ₦${m.amount} (${m.percentage}%)`)
                              .join('\n')}`
                          );
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
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

            {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
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
            ))}

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
    </div>
  );
};

export default PaymentsHistory;