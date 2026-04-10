import React, { useState } from "react";
import Modal from "./ui/Modal";
import toast from "react-hot-toast";
import { signIn, signUp } from "@/src/lib/authClient";

export default function AuthModal({ open, onClose, onAuthed }) {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp({ name: form.name, email: form.email, password: form.password });
        toast.success("Account created");
      } else {
        await signIn({ email: form.email, password: form.password });
        toast.success("Signed in");
      }
      onAuthed?.();
    } catch (err) {
      toast.error(err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Sign in to continue" size="md">
      <div className="space-y-4">
        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${mode === "signin" ? "bg-white shadow-sm text-slate-900" : "text-slate-600"}`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${mode === "signup" ? "bg-white shadow-sm text-slate-900" : "text-slate-600"}`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A59D1]/20"
                placeholder="Your name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A59D1]/20"
              placeholder="you@firm.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A59D1]/20"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg px-4 py-2 text-sm font-semibold text-white ${loading ? "bg-slate-400" : "bg-[#2A59D1] hover:bg-[#002D9F]"}`}
          >
            {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>

          <p className="text-xs text-slate-500">
            This is a lightweight demo auth. We’ll later swap it to a real backend auth (JWT/NextAuth) once MongoDB connectivity is stable.
          </p>
        </form>
      </div>
    </Modal>
  );
}

