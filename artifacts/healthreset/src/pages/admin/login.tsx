import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const login = useAdminLogin();
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("admin_token")) {
      setLocation("/admin/dashboard");
    }
  }, [setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    login.mutate(
      { data: { password } },
      {
        onSuccess: (data) => {
          localStorage.setItem("admin_token", data.token);
          setLocation("/admin/dashboard");
        },
        onError: () => {
          setError("Invalid password");
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 text-ink">
      <div className="w-full max-w-md bg-bone/30 border border-ink/10 rounded-[32px] p-8 md:p-12 shadow-sm">
        <div className="flex justify-center mb-8 text-olive">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="font-display text-4xl text-center mb-2 tracking-tight">Admin Area</h1>
        <p className="text-center text-ink/50 text-sm mb-8 tracking-wide uppercase">Dr. Shweta Tripathi</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] tracking-[0.1em] uppercase text-ink/60">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-3 focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive/30 transition-all"
              placeholder="••••••••"
              required
            />
            {error && <p className="text-terracotta text-xs">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={login.isPending}
            className="w-full rounded-full bg-ink text-cream py-4 font-medium tracking-[0.05em] hover:bg-olive transition-colors disabled:opacity-50"
          >
            {login.isPending ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
