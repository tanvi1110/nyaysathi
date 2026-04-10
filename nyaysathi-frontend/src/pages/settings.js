import Layout from "../components/layout/Layout";
import { useAuth } from "@/src/lib/AuthContext";
import AuthModal from "@/src/components/AuthModal";
import { useState } from "react";
import { Button } from "@/src/components/ui/Button";

export default function SettingsPage() {
  const { user, isAuthed, signOut, onAuthed } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <Layout>
      <div className="min-h-screen pb-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-600">Account and workspace preferences.</p>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-medium text-slate-700">Authentication</div>
              {isAuthed ? (
                <div className="mt-1 text-sm text-slate-600">
                  Signed in as <span className="font-medium text-slate-900">{user?.email}</span>
                </div>
              ) : (
                <div className="mt-1 text-sm text-slate-600">
                  You are browsing as a guest. You’ll be asked to sign in when you try to add tasks, events, or contacts.
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!isAuthed ? (
                <Button variant="primary" onClick={() => setOpen(true)}>
                  Sign in / Sign up
                </Button>
              ) : (
                <Button variant="outline" onClick={signOut}>
                  Sign out
                </Button>
              )}
            </div>
          </div>
        </div>

        <AuthModal
          open={open}
          onClose={() => setOpen(false)}
          onAuthed={() => {
            setOpen(false);
            onAuthed?.();
          }}
        />
      </div>
    </Layout>
  );
}

