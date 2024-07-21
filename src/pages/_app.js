import { FirebaseProvider } from "@/firebase/firebase";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <FirebaseProvider>
      <Component {...pageProps} />
    </FirebaseProvider>)
}
