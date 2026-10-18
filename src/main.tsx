import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/manrope";
import "@fontsource/dm-serif-display/latin-400.css";
import "@fontsource/dm-serif-display/latin-400-italic.css";
import "./styles.css";
import App from "./App";
import { profile } from "./content/profile";

if (import.meta.env.DEV)
  document.title = `${profile.name}, ${profile.suffix} | AI Research & Education`;

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
if (root.querySelector("main")) hydrateRoot(root, app);
else createRoot(root).render(app);
