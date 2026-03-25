import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, User2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

function SparkleIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M60 0C60 33.137 86.863 60 120 60C86.863 60 60 86.863 60 120C60 86.863 33.137 60 0 60C33.137 60 60 33.137 60 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SmallSparkle({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="5" fill="currentColor" />
    </svg>
  );
}


export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      const firstError =
        typeof payload === "object" ? Object.values(payload)[0] : null;
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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#E91E63] px-4 py-8">
      {/* Decorative sparkles — top right */}
      <div className="pointer-events-none absolute right-6 top-20 sm:right-16 sm:top-24">
        <SparkleIcon className="h-20 w-20 text-pink-300/40 sm:h-28 sm:w-28" />
        <div className="absolute -top-2 right-1">
          <SparkleIcon className="h-6 w-6 text-pink-200/30" />
        </div>
        <SmallSparkle className="absolute -bottom-3 -left-4 h-4 w-4 text-pink-300/35" />
        <SmallSparkle className="absolute -right-2 top-2 h-3 w-3 text-pink-200/25" />
      </div>

      {/* Decorative sparkles — bottom left */}
      <div className="pointer-events-none absolute bottom-24 left-8 sm:bottom-28 sm:left-14">
        <SmallSparkle className="h-5 w-5 text-pink-300/35" />
        <SmallSparkle className="absolute -right-4 top-4 h-3 w-3 text-pink-200/25" />
      </div>

      {/* ── Branding Section ── */}
      <div className="relative z-10 mb-8 flex flex-col items-center">
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-[1.25rem] bg-white shadow-xl">
          <img src="/logo.jpeg" alt="Renderways" className="h-16 w-16 object-contain" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Renderways
        </h1>
        <p className="mt-2 text-center text-sm leading-relaxed text-pink-100/90 sm:text-base">
          Sign in to access your creative
          <br />
          workspace
        </p>
      </div>

      {/* ── Login Card ── */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="mt-1.5 text-center text-sm text-slate-500">
            Please enter your credentials to continue
          </p>
        </div>

        {error ? (
          <div className="mt-5 rounded-xl border border-rose-100 bg-rose-50 p-3 text-center text-sm text-rose-600">
            {error}
          </div>
        ) : null}

        <form className="mt-7 space-y-5" onSubmit={handleLoginSubmit}>
          {/* Username */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Username
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-pink-500">
                <User2 className="h-5 w-5" />
              </div>
              <input
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm((c) => ({ ...c, username: e.target.value }))
                }
                placeholder="Enter your username"
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-pink-500">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <input
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((c) => ({ ...c, password: e.target.value }))
                }
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#E91E63] px-4 py-4 text-base font-semibold text-white shadow-lg shadow-pink-500/30 transition-all hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-[#E91E63]/20 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
            {!isSubmitting ? <ArrowRight className="h-5 w-5" /> : null}
          </button>
        </form>
      </div>
    </div>
  );
}
