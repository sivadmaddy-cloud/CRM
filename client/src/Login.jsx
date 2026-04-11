import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) e.email = "Please enter a valid email.";
    if (!data.password) e.password = "Password is required.";
    return e;
  };

  const login = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setServerError(""); setLoading(true);
    try {
      const res = await fetch("https://crm-ls2y.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) { setServerError(result.message ?? "Invalid email or password."); return; }
      localStorage.setItem("token", result.token);
      navigate("/dashboard");
    } catch {
      setServerError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen   bg-black flex items-center justify-center px-4">
      <div className="bg-[#1E1E1E] border border-[#30363D] rounded-2xl shadow-sm p-10 w-full max-w-md">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-6">
          <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
        </div>
        <h1 className="text-xl font-semibold text-center text-white  mb-1">Welcome back</h1>
        <p className="text-sm text-center text-white mb-8">Sign in to your CRM account</p>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">{serverError}</div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Email address</label>
            <input
              type="email"
              value={data.email}
              placeholder="you@company.com"
              onChange={e => setData({ ...data, email: e.target.value })}
              className={`w-full h-10 border rounded-lg px-3 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${errors.email ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Password</label>
            <input
              type="password"
              value={data.password}
              placeholder="••••••••"
              onChange={e => setData({ ...data, password: e.target.value })}
              className={`w-full h-10 border rounded-lg px-3 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${errors.password ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>
        </div>

        <button
          onClick={login}
          disabled={loading}
          className="w-full h-10 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-sm text-center text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}