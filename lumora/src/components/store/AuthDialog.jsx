import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AuthDialog({
  open,
  onOpenChange,
  user,
  onAuthSuccess,
  onLogout,
  promptMessage,
}) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const handleOpenChange = (nextOpen) => {
    if (nextOpen) setError("");
    onOpenChange(nextOpen);
  };

  useEffect(() => {
    if (open && user) {
      apiFetch("/orders/my")
        .then((data) => setOrders(data.orders || []))
        .catch(() => setOrders([]));
    }
  }, [open, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        mode === "login" ? { email, password } : { name, email, password };

      const data = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      onAuthSuccess(data.user);
      setName("");
      setEmail("");
      setPassword("");
      onOpenChange(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    onLogout();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[440px] bg-[#FFFEF2] text-[#252525] rounded-none border-[#D4CFC4] p-8">
        {user ? (
          /* ---------------- LOGGED-IN ACCOUNT VIEW ---------------- */
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl font-normal">
                Welcome, {user.name}
              </DialogTitle>
            </DialogHeader>
            <p className="text-[13px] text-[#66635B]">{user.email}</p>

            <div className="border-t border-[#E2DDD2] pt-4">
              <h3 className="text-[13px] font-medium mb-3">
                Your Recent Orders ({orders.length})
              </h3>
              {orders.length === 0 ? (
                <p className="text-[12px] text-[#66635B]">
                  No orders placed yet.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {orders.map((ord) => (
                    <div
                      key={ord._id}
                      className="border border-[#E2DDD2] bg-white p-3 text-[12px] flex justify-between"
                    >
                      <div>
                        <p className="font-medium">
                          #{ord._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-[#66635B]">
                          {ord.items.length} item(s) • {ord.orderStatus}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${ord.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full border border-[#252525] py-3 text-[13px] hover:bg-[#252525] hover:text-white transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </div>
        ) : (
          /* ---------------- SIGN IN / CREATE ACCOUNT ---------------- */
          <div>
            <DialogHeader className="mb-5">
              <DialogTitle className="font-serif text-2xl font-normal">
                {mode === "login" ? "Sign in to Lumora" : "Create an account"}
              </DialogTitle>
              {promptMessage && (
                <p className="text-[12px] text-[#9C6D3E] pt-1">
                  {promptMessage}
                </p>
              )}
            </DialogHeader>

            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 border-b border-[#E2DDD2] mb-6 text-[13px]">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className={`pb-2.5 border-b-2 cursor-pointer ${
                  mode === "login"
                    ? "border-[#252525] font-medium"
                    : "border-transparent text-[#66635B]"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className={`pb-2.5 border-b-2 cursor-pointer ${
                  mode === "register"
                    ? "border-[#252525] font-medium"
                    : "border-transparent text-[#66635B]"
                }`}
              >
                Create account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-[#D4CFC4] px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#252525]"
                />
              )}

              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#D4CFC4] px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#252525]"
              />

              <input
                type="password"
                required
                minLength={6}
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#D4CFC4] px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#252525]"
              />

              {error && <p className="text-[12px] text-red-700">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#333333] hover:bg-[#1A1A1A] disabled:opacity-50 text-white py-3 text-[13px] font-medium transition-colors cursor-pointer"
              >
                {loading
                  ? "Please wait..."
                  : mode === "login"
                  ? "Sign in"
                  : "Create account"}
              </button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}