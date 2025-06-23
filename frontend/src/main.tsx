import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app.tsx";

if (import.meta.env.DEV) {
  const { setupMockAPI } = await import("@/lib/axios.mock");
  setupMockAPI();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
