import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ListingPage } from "./listing-page";

import "./index.css";
import "./dark.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ListingPage />
  </StrictMode>
);
