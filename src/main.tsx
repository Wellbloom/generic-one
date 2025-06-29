import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Debug logging - Application startup
console.log("🚀 [DEBUG] Starting Wellbloom React Application...");
console.log("🚀 [DEBUG] Environment:", import.meta.env.MODE);
console.log("🚀 [DEBUG] Base URL:", import.meta.env.BASE_URL);

// Check if root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error(
    "❌ [ERROR] Root element not found! Check your index.html file."
  );
  throw new Error("Root element not found");
}

console.log("✅ [DEBUG] Root element found:", rootElement);

try {
  console.log("🚀 [DEBUG] Creating React root...");
  const root = createRoot(rootElement);

  console.log("🚀 [DEBUG] Rendering App component...");
  root.render(<App />);

  console.log("✅ [SUCCESS] App component rendered successfully!");
} catch (error) {
  console.error("❌ [ERROR] Failed to render app:", error);

  // Fallback error display
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="color: red;">Application Error</h1>
      <p>Failed to start the React application.</p>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">${error}</pre>
    </div>
  `;
}
