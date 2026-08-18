import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminService, type DashboardStats } from '../../services/adminService';
import {
  Beer,
  Newspaper,
  Briefcase,
  Users,
  Mail,
  Loader2,
  AlertCircle,
  ArrowRight,
  Clock,
} from 'lucide-react';
import type { Application, Enquiry } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsData, appsData, enquiriesData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getApplications({ page: 1, limit: 5 }),
          adminService.getEnquiries({ page: 1, limit: 5 }),
        ]);

        if (isMounted) {
          setStats(statsData);
          setRecentApps(appsData.data || []);
          setRecentEnquiries(enquiriesData.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || 'Failed to load dashboard data.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <AdminLayout
      title="CMS Dashboard Overview"
      subtitle="Operational summary and live website statistics"
    >
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-unb-navy animate-spin" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Loading dashboard metrics...
          </p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xs flex items-center gap-3 text-xs text-red-700">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      ) : stats ? (
        <div className="space-y-8">
          {/* STATS METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Products */}
            <Link
              to="/admin/products"
              className="bg-white p-5 rounded-xs border border-gray-200 shadow-xs hover:border-unb-navy transition-all group"
            >
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">Products</span>
                <Beer className="w-5 h-5 text-unb-amber group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-unb-navy">{stats.totalProducts}</span>
                <span className="text-[11px] font-semibold text-green-600">
                  {stats.publishedProducts} published
                </span>
              </div>
            </Link>

            {/* News */}
            <Link
              to="/admin/news"
              className="bg-white p-5 rounded-xs border border-gray-200 shadow-xs hover:border-unb-navy transition-all group"
            >
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">News & Media</span>
                <Newspaper className="w-5 h-5 text-unb-amber group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-unb-navy">{stats.totalNews}</span>
                <span className="text-[11px] font-semibold text-green-600">
                  {stats.publishedNews} published
                </span>
              </div>
            </Link>

            {/* Jobs */}
            <Link
              to="/admin/careers"
              className="bg-white p-5 rounded-xs border border-gray-200 shadow-xs hover:border-unb-navy transition-all group"
            >
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">Careers</span>
                <Briefcase className="w-5 h-5 text-unb-amber group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-unb-navy">{stats.totalJobs}</span>
                <span className="text-[11px] font-semibold text-green-600">
                  {stats.publishedJobs} active
                </span>
              </div>
            </Link>

            {/* Applications */}
            <Link
              to="/admin/applications"
              className="bg-white p-5 rounded-xs border border-gray-200 shadow-xs hover:border-unb-navy transition-all group"
            >
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">Applications</span>
                <Users className="w-5 h-5 text-unb-amber group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-unb-navy">{stats.totalApplications}</span>
                <span className="text-[11px] font-semibold text-amber-600">
                  {stats.newApplications} new
                </span>
              </div>
            </Link>

            {/* Enquiries */}
            <Link
              to="/admin/enquiries"
              className="bg-white p-5 rounded-xs border border-gray-200 shadow-xs hover:border-unb-navy transition-all group"
            >
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">Enquiries</span>
                <Mail className="w-5 h-5 text-unb-amber group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-unb-navy">{stats.totalEnquiries}</span>
                <span className="text-[11px] font-semibold text-gray-500">total received</span>
              </div>
            </Link>
          </div>

          {/* TWO COLUMN SUMMARY: RECENT APPLICATIONS & RECENT ENQUIRIES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Applications */}
            <div className="bg-white border border-gray-200 rounded-xs shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-unb-navy" />
                  <h3 className="text-sm font-black text-unb-navy uppercase tracking-wider">
                    Recent Job Applications
                  </h3>
                </div>
                <Link
                  to="/admin/applications"
                  className="text-xs font-bold text-unb-navy hover:text-unb-amber flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentApps.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">No applications submitted yet.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentApps.map((app) => (
                    <div key={app.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-900">{app.name}</p>
                        <p className="text-[11px] text-gray-500">{app.job?.title || 'General Application'}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-xs ${
                            app.applicationStatus === 'NEW'
                              ? 'bg-amber-100 text-amber-800'
                              : app.applicationStatus === 'SHORTLISTED'
                              ? 'bg-green-100 text-green-800'
                              : app.applicationStatus === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {app.applicationStatus}
                        </span>
                        <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(app.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Enquiries */}
            <div className="bg-white border border-gray-200 rounded-xs shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-unb-navy" />
                  <h3 className="text-sm font-black text-unb-navy uppercase tracking-wider">
                    Recent Contact Enquiries
                  </h3>
                </div>
                <Link
                  to="/admin/enquiries"
                  className="text-xs font-bold text-unb-navy hover:text-unb-amber flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentEnquiries.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">No contact enquiries received yet.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentEnquiries.map((enq) => (
                    <div key={enq.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-900">{enq.name}</p>
                        <p className="text-[11px] text-gray-500 truncate max-w-xs">{enq.message}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-xs bg-gray-100 text-gray-800">
                          {enq.enquiryType}
                        </span>
                        <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(enq.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
};
