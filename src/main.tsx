
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { setupMockAPI } from "./app/services/mockApi";
  import "./styles/index.css";

  // Initialize mock API for authentication and user data
  // Note: This provides mock endpoints for login, user data, etc.
  // In production, replace with real backend API calls
  setupMockAPI();

  createRoot(document.getElementById("root")!).render(<App />);
  