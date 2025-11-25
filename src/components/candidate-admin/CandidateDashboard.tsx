import React, { useEffect, useState } from "react";
import {
  User,
  Bookmark,
  Eye,
  FileText,
  TrendingUp,
  Calendar,
  MoreVertical,
  TrendingDown,
  Briefcase,
  MapPin,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { httpGetWithToken } from "../../utils/http_utils";

/* ---------------------------
   Types
   --------------------------- */
type Company = {
  id?: number;
  name?: string;
};

type AppliedJob = {
  id: number;
  title?: string;
  slug?: string;
  company?: Company;
  location?: string;
  date_applied: string;
  status?: string;
};

type StatusData = {
  name: string;
  value: number;
};

type StatCard = {
  title: string;
  value: number | string;
  change?: string;
  trend?: "up" | "down" | "";
  color?: string;
  icon?: React.ReactNode;
};

/* ---------------------------
   Component
   --------------------------- */
const CandidateDashboard: React.FC = () => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  // Fetch applied jobs for this candidate
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const res = await httpGetWithToken("candidate/applied-jobs");
        // Your backend returns { status: 'success', data: [...] } as per your other components.
        if (res && res.status === "success" && Array.isArray(res.data)) {
          // normalize date fields if needed
          setAppliedJobs(res.data as AppliedJob[]);
        } else if (res && res.data && Array.isArray(res.data)) {
          // fallback if API shape is different
          setAppliedJobs(res.data as AppliedJob[]);
        } else {
          setAppliedJobs([]);
        }
      } catch (err) {
        console.error("Failed to fetch applied jobs:", err);
        setAppliedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /* ---------------------------
     Derived metrics & chart data
     --------------------------- */

  // Total applications
  const totalApplications = appliedJobs.length;

  // Application activity by day of week (Mon..Sun)
  const weekdayShorts = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const applicationData = weekdayShorts.map((dayShort) => {
    const count = appliedJobs.filter((job) => {
      if (!job.date_applied) return false;
      const d = new Date(job.date_applied);
      // Some backends may send invalid dates — guard it
      if (isNaN(d.getTime())) return false;
      const wk = d.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue...
      return wk === dayShort;
    }).length;

    return { day: dayShort, applications: count };
  });

  // Status distribution
  const statusCounts = appliedJobs.reduce<Record<string, number>>((acc, job) => {
    const status = (job.status || "Pending").toString();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const applicationStatusData: StatusData[] = Object.keys(statusCounts).map(
    (status) => ({
      name: status,
      value: statusCounts[status],
    })
  );

  // Stats cards (you can expand these)
  const stats: StatCard[] = [
    {
      title: "Applications Sent",
      value: totalApplications,
      change: "", // you can compute weekly change if you have historical data
      trend: "",
      color: "from-purple-500 to-pink-500",
      icon: <FileText size={24} />,
    },
    {
      title: "Profile Views",
      value: "—", // static placeholder (no endpoint provided)
      change: "+28 today",
      trend: "up",
      color: "from-emerald-500 to-teal-500",
      icon: <Eye size={24} />,
    },
    {
      title: "Saved Jobs",
      value: "—",
      change: "+3 new matches",
      trend: "up",
      color: "from-blue-500 to-cyan-500",
      icon: <Bookmark size={24} />,
    },
    {
      title: "Job Engagements",
      value: "—",
      change: "+2 pending",
      trend: "up",
      color: "from-amber-500 to-orange-500",
      icon: <User size={24} />,
    },
  ];

  // Colors for pie chart (cycle if there are more statuses)
  const COLORS = ["#8B5CF6", "#10B981", "#3B82F6", "#F59E0B", "#EF4444"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8 mt-20 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                Welcome Back, Candidate!
              </h1>
              <p className="text-slate-600 flex items-center gap-2">
                <Calendar className="text-blue-500" size={18} />
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                >
                  {stat.icon}
                </div>
                <span className="text-emerald-500 text-sm font-semibold flex items-center gap-1">
                  <TrendingUp size={16} /> {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-slate-600 font-medium">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Application Activity
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTimeRange("week")}
                  className={`px-3 py-1 rounded ${
                    timeRange === "week"
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTimeRange("month")}
                  className={`px-3 py-1 rounded ${
                    timeRange === "month"
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  Month
                </button>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical size={24} />
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={applicationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Application Status
            </h2>

            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={applicationStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.name} (${entry.value})`}
                >
                  {applicationStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {applicationStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recommended Jobs */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Recommended Jobs
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "Senior React Developer",
                  company: "Tech Innovations Inc.",
                  location: "Remote",
                  salary: "$120k - $150k",
                  posted: "2 days ago",
                  match: 95,
                },
                {
                  title: "Full Stack Engineer",
                  company: "StartUp Labs",
                  location: "San Francisco, CA",
                  salary: "$130k - $160k",
                  posted: "1 week ago",
                  match: 88,
                },
              ].map((job, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">{job.company}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {job.posted}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          job.match >= 90
                            ? "bg-emerald-100 text-emerald-700"
                            : job.match >= 80
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {job.match}% Match
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                    <span className="text-sm font-semibold text-slate-900">
                      {job.salary}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Apply →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4 mb-6">
              {[
                {
                  action: "Application viewed",
                  company: "Tech Innovations Inc.",
                  position: "Senior Frontend Developer",
                  time: "10 min ago",
                  avatar: "TI",
                },
                {
                  action: "Interview scheduled",
                  company: "Design Studio Co.",
                  position: "UX/UI Designer",
                  time: "2 hours ago",
                  avatar: "DS",
                },
                {
                  action: "Application submitted",
                  company: "StartUp Labs",
                  position: "Product Manager",
                  time: "5 hours ago",
                  avatar: "SL",
                },
                {
                  action: "Profile viewed",
                  company: "Data Corp",
                  position: "Data Analyst position",
                  time: "1 day ago",
                  avatar: "DC",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {activity.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-slate-600">{activity.company}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {activity.position} · {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
