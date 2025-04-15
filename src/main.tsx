import { createRoot } from "react-dom/client";
import { App } from "./app";
import "./index.css";
import { Toaster } from "./shared/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster />
  </>
);
