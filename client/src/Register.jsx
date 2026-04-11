import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const getStrength = (p) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p) || p.length >= 12) s++;
    return s;
  };

  const strengthLabel = ["", "Weak", "Fair", "Strong"];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-green-500"];
  const strength = getStrength(data.password);

  const validate = () => {
    const e = {};
    if (!data.firstName.trim()) e.firstName = "Required";
    if (!data.lastName.trim()) e.lastName = "Required";
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) e.email = "Please enter a valid email.";
    if (data.password.length < 8) e.password = "Password must be at least 8 characters.";
    return e;
  };

  const register = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setLoading(true);
    try {
      const res = await fetch("https://crm-ls2y.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          password: data.password,
        }),
      });
      const result = await res.json();
      if (!res.ok) { setErrors({ server: result.message ?? "Registration failed." }); return; }
      navigate("/");
    } catch {
      setErrors({ server: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full h-10 border rounded-lg px-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition
     focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 focus:border-indigo-500
     ${errors[field] ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`;

  return (
    <div className="min-h-screen bg-black flex  items-center justify-center px-4 py-10">
      <div className="w-full  max-w-md">
        <div className="bg-[#1E1E1E] border border-[#30363D]  rounded-2xl border border-gray-200 shadow-sm px-8 py-10">

         <div className="text-center mb-5">
  <span className="inline-block bg-indigo-50 text-indigo-600 text-sm font-medium px-3 py-1 rounded-full">
    Create account
  </span>
</div>

          <h1 className="text-xl text-center font-semibold text-white justify-center items-center mb-1">Join your team</h1>
          <p className="text-sm text-white text-center  mb-7">Set up your CRM account in seconds</p>

          {errors.server && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
              {errors.server}
            </div>
          )}

          {/* First + Last name */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-m font-medium text-gray-500 mb-1.5">First name</label>
              <input
                value={data.firstName}
                placeholder="Alex"
                onChange={e => setData({ ...data, firstName: e.target.value })}
                className={inputClass("firstName")}
              />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-m font-medium text-gray-500 mb-1.5">Last name</label>
              <input
                value={data.lastName}
                placeholder="Kim"
                onChange={e => setData({ ...data, lastName: e.target.value })}
                className={inputClass("lastName")}
              />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-m font-medium text-gray-500 mb-1.5">Work email</label>
            <input
              type="email"
              value={data.email}
              placeholder="duo@company.com"
              onChange={e => setData({ ...data, email: e.target.value })}
              className={inputClass("email")}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password + strength */}
          <div className="mb-6">
            <label className="block text-m  font-medium text-gray-500 mb-1.5">Password</label>
            <input
              type="password"
              value={data.password}
              placeholder="Min 8 characters"
              onChange={e => setData({ ...data, password: e.target.value })}
              className={inputClass("password")}
            />
            {data.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : "bg-gray-200"}`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-medium ${strength === 1 ? "text-red-500" : strength === 2 ? "text-amber-500" : "text-green-600"}`}>
                  {strengthLabel[strength]}
                </p>
              </div>
            )}
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <button
            onClick={register}
            disabled={loading}
            className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          <p className="text-xs text-gray-400 text-center mt-3">
            By registering you agree to our{" "}
            <a href="#" className="text-gray-500 hover:underline">Terms</a> &amp;{" "}
            <a href="#" className="text-gray-500 hover:underline">Privacy Policy</a>
          </p>

          <p className="text-sm text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}