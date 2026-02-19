import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { trackPageView } from "@/lib/beacon";

// Fire initial page view beacon
trackPageView(window.location.pathname);

createRoot(document.getElementById("root")!).render(<App />);
