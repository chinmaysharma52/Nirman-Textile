import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
      login(data.user);
      if (data.user.isAdmin) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-900">
          Welcome back
        </h1>
        <p className="text-xs text-slate-500">
          Login to continue shopping or access your orders.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div className="space-y-1">
          <label className="font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-1">
          <label className="font-medium text-slate-700">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {error && (
          <p className="text-xs text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex justify-center px-4 py-2.5 rounded-full bg-primary text-white text-sm font-medium shadow-sm hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-[11px] text-slate-500">
        New to Nirman Textile?{" "}
        <Link
          to="/signup"
          className="text-primary font-medium hover:text-primary-dark"
        >
          Create an account
        </Link>
      </p>

      <div className="rounded-xl bg-slate-50 border border-dashed border-slate-200 p-3 text-[11px] text-slate-600">
        <p className="font-semibold text-slate-800 mb-1">
          Sample admin login
        </p>
        <p>Email: <span className="font-mono">admin@nirmantextile.com</span></p>
        <p>Password: <span className="font-mono">Admin@123</span></p>
      </div>
    </div>
  );
};

export default LoginPage;

