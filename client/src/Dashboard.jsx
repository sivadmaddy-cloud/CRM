import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function getInitials(name) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const token = localStorage.getItem("token");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const load = async () => {
    try {
      const res = await fetch("https://crm-ls2y.onrender.com/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate("/"); return; }
      setCustomers(await res.json());
    } catch { showToast("Failed to load customers."); }
  };

  useEffect(() => { if (!token) { navigate("/"); return; } load(); }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required.";
    return e;
  };

  const add = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    await fetch("https://crm-ls2y.onrender.com/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setForm({ name: "", email: "" });
    showToast("Customer added successfully");
    load();
  };

  const del = async (id) => {
    await fetch(`https://crm-ls2y.onrender.com/api/customers/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    showToast("Customer removed");
    load();
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Topbar */}
      <nav className=" bg-[#1E1E1E] border border-[#30363D] px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="  w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
          </div>
          <span className="text-sm font-medium text-white ">CRM</span>
        </div>
        <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }} className="text-sm border rounded-xl px-2 py-1 text-white border-[#30363D] bg-[#1E1E1E]  ">Sign out</button>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[["Total customers", customers.length], ["Showing", filtered.length], ["Active", customers.length]].map(([label, val]) => (
            <div key={label} className=" border bg-[#1E1E1E] border border-[#30363D] rounded-xl p-4">
              <p className="text-m text-white  mb-1">{label}</p>
              <p className="text-2xl font-medium text-white ">{val}</p>
            </div>
          ))}
        </div>

        {/* Add form */}
        <div className="bg-[#1E1E1E] border border-[#30363D]  border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="text-m font-medium text-white mb-4">Add customer</h2>
          <div className="flex gap-5 items-start">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Full name </label>
              <input
                value={form.name}
                placeholder="Jane Smith"
                onChange={e => setForm({ ...form, name: e.target.value })}
                className={`w-full h-9 border rounded-lg px-3 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${errors.name ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email address </label>
              <input
                type="email"
                value={form.email}
                placeholder="jane@company.com"
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={`w-full h-9 border rounded-lg px-3 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${errors.email ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <button
              onClick={add}
              className="mt-[21px] h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition whitespace-nowrap"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Customer list */}
        <div className="bg-[#1E1E1E] border border-[#30363D]  border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-m font-medium text-white">
              Customers{" "}
              <span className="bg-indigo-50 text-indigo-600 text-xs font-medium px-2 py-0.5 rounded-full ml-1">{customers.length}</span>
            </h2>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              className="h-8 w-44 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          {filtered.length === 0 ? (
            <p className="text-m text-gray-400 text-center py-10">No customers found.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-xs font-medium text-white text-left pb-3 px-2">Customer</th>
                  <th className="text-xs font-medium text-white  text-left pb-3 px-2">Email</th>
                  <th className="text-xs font-medium text-white  pb-3 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c._id} className="border-b border-gray-50 ">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-medium text-indigo-600 shrink-0">
                          {getInitials(c.name)}
                        </div>
                        <span className="text-sm text-white">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-500">{c.email}</td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => del(c._id)}
                        className="text-xs text-white hover:text-white  border  hover:border-[#1E1E1E] hover:bg-[#1E1E1E] px-3 py-1.5 rounded-lg transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}