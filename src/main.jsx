import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
// import "./css/index.css";
// import "./css/Login.css";
// import "./css/Style.css";
// import "./css/Queries.css";
import "./css/main.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
