

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { appStore } from "./app/store";
import { Toaster } from "./components/ui/sonner.jsx";
import { ThemeProvider } from "./components/ThemeProvider";
import DarkMode from "./DarkMode";
// import { useLoadUserQuery } from "./features/api/authApi";
// import LoadingSpinner from "./components/LoadingSpinner";



createRoot(document.getElementById("root")).render(
  <StrictMode>
    
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme"> 
      <Provider store={appStore}>
        <App />
        <Toaster />
      </Provider>
    </ThemeProvider>
    {/* <BrowserRouter> */}
    {/* <Provider store={appStore}> */}
      {/* /<Custom> */}
      
        {/* <App /> */}
        {/* <Toaster /> */}
      {/* </Custom> */}
      
    {/* </Provider> */}
  {/* </BrowserRouter> */}
    
  </StrictMode>
)