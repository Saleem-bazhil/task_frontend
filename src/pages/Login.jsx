import { useState } from "react";
import { ArrowRight, LockKeyhole, MessageSquare, User2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const destination = location.state?.from?.pathname || "/app/messages";

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await login(loginForm);
      navigate(destination, { replace: true });
    } catch (requestError) {
      const payload = requestError.response?.data;
      const firstError = typeof payload === "object" ? Object.values(payload)[0] : null;
      setError(
        requestError.response?.data?.detail ||
          (Array.isArray(firstError) ? firstError[0] : firstError) ||
          "Invalid username or password."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8 sm:px-6">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200/40 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-8 shadow-2xl shadow-slate-200/50 sm:p-10">
        <div className="flex flex-col items-center">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-100/50">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Sign in to your workspace to continue.
          </p>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-rose-100 bg-rose-50 p-3 text-center text-sm text-rose-600">
            {error}
          </div>
        ) : null}

        <form className="mt-8 space-y-5" onSubmit={handleLoginSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Username
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-sky-500">
                <User2 className="h-5 w-5" />
              </div>
              <input
                value={loginForm.username}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, username: event.target.value }))
                }
                placeholder="Enter your username"
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-sky-500">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <input
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, password: event.target.value }))
                }
                type="password"
                placeholder="••••••••"
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
            {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </form>
      </div>
    </div>
  );
}