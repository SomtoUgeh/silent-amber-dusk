import App from "./App";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";

import "./css/colors.css";
import "./css/fonts.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
    },
  },
});

const rootContainer = document.getElementById("root");
const root = createRoot(rootContainer);
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
