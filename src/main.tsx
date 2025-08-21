import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { ToastsProvider } from "./components/Toasts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <ToastsProvider>
          <App />
      </ToastsProvider>
  </StrictMode>,
)
