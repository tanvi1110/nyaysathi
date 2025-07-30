import "@/styles/globals.css";
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/next"
export default function App({ Component, pageProps }) {
  return (
    <>
      <Toaster position="top-center" />
      <Analytics />
      <Component {...pageProps} />;
    </>
  )
}
