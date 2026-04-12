
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { setupMockAPI } from "./app/services/mockApi";
  import "./styles/index.css";

  // Initialize mock API BEFORE rendering the app
  setupMockAPI();

  createRoot(document.getElementById("root")!).render(<App />);
  