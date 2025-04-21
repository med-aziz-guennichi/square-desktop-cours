import React from 'react';
import ReactDOM from 'react-dom/client';
import { LoadingBarContainer } from 'react-top-loading-bar';
import { Toaster } from 'sonner';
import App from './App';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import './index.css';
import { ConfettiProvider } from './providers/confetti-provider';
import { NetworkStatusProvider } from './providers/network-provider';
import { ThemeProvider } from './providers/theme-provider';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LoadingBarContainer>
        <BreadcrumbProvider>
          <ConfettiProvider />
          <NetworkStatusProvider>
            <App />
          </NetworkStatusProvider>
        </BreadcrumbProvider>
      </LoadingBarContainer>
      <Toaster richColors theme="dark" />
    </ThemeProvider>
  </React.StrictMode>,
);
