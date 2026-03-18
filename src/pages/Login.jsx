import { useState } from "react";
import { ArrowRight, LockKeyhole, MessageSquare, ShieldCheck, User2 } from "lucide-react";
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
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.14),_transparent_24%),linear-gradient(135deg,_#ecfeff,_#f8fafc_38%,_#fff7ed)] px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_45px_120px_-55px_rgba(15,23,42,0.45)] backdrop-blur xl:grid-cols-[1.05fr_0.95fr]">
     
          <div className="w-full">
            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-[linear-gradient(135deg,_#cffafe,_#e0f2fe)] text-sky-700 shadow-inner">
                <MessageSquare className="h-7 w-7" />
              </div>
              <p className="mt-6 text-sm font-medium uppercase tracking-[0.28em] text-sky-700">Welcome back</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Sign in to your workspace</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                Use your credentials to access conversations, tasks, and real-time updates.
              </p>

              {error ? <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

              <form className="mt-8 space-y-5" onSubmit={handleLoginSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Username</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-sky-400 focus-within:bg-white">
                    <User2 className="h-4 w-4 text-slate-400" />
                    <input
                      value={loginForm.username}
                      onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))}
                      placeholder="Enter your username"
                      className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-sky-400 focus-within:bg-white">
                    <LockKeyhole className="h-4 w-4 text-slate-400" />
                    <input
                      value={loginForm.password}
                      onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                      type="password"
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                      required
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,_#0284c7,_#0369a1)] px-4 py-3.5 text-sm font-medium text-white shadow-[0_20px_40px_-25px_rgba(2,132,199,0.9)] transition hover:translate-y-[-1px] hover:shadow-[0_22px_46px_-24px_rgba(2,132,199,0.95)] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                  {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              </form>

              <div className="mt-8 rounded-[1.6rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500 xl:hidden">
                Secure access to chat, tasks, and workspace updates.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
