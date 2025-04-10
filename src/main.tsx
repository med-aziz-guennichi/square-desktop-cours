import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./providers/theme-provider";
import { Toaster } from "sonner";
import { LoadingBarContainer } from "react-top-loading-bar";
import { BreadcrumbProvider } from "./context/BreadcrumbContext";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LoadingBarContainer>
        <BreadcrumbProvider>
          <App />
        </BreadcrumbProvider>
      </LoadingBarContainer>
      <Toaster richColors theme="dark" />
    </ThemeProvider>
  </React.StrictMode>,
);
