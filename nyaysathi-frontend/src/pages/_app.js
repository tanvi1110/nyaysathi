import "@/styles/globals.css";
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/src/lib/AuthContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          className: "text-sm font-medium shadow-lg",
          duration: 4000,
        }}
      />
      <Analytics />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
