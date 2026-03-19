import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type Stats = {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/stats`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2 border-b border-black/5 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Metrics for products, orders, and revenue.
          </p>
        </div>
      </div>

      {!stats ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-6">
          <Link
            to="/admin/orders"
            className="bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-start gap-5 transform hover:-translate-y-1.5 block animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Total Orders
              </p>
              <p className="text-3xl font-bold tracking-tight text-primary">
                {stats.totalOrders}
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-orange-100 text-orange-800">
              Pending: {stats.pendingOrders}
            </span>
          </Link>
          <Link
            to="/admin/products"
            className="bg-gradient-to-br from-purple-50 to-white rounded-3xl border border-purple-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-start gap-5 transform hover:-translate-y-1.5 block animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-500 flex items-center justify-center shadow-md shadow-purple-500/20">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Total Products
              </p>
              <p className="text-3xl font-bold tracking-tight text-primary">
                {stats.totalProducts}
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-800">
              Customers: {stats.totalUsers}
            </span>
          </Link>
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl border border-emerald-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-start gap-5 transform hover:-translate-y-1.5 block animate-fade-in-up"
            style={{ animationDelay: "300ms" }}>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Revenue (COD)
              </p>
              <p className="text-3xl font-bold tracking-tight text-primary">
                ₹{stats.totalRevenue.toLocaleString("en-IN")}
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-800">
              Delivered: {stats.deliveredOrders}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;

