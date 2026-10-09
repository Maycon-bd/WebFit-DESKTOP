import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { WindowTitleBar } from "./WindowTitleBar";
import "./style.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="window-shell">
      <WindowTitleBar />
      <div className="window-content">
        <App />
      </div>
    </div>
  </React.StrictMode>,
);
