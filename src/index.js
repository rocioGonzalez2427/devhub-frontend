import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./index.css";

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./apolloClient";
import { BrowserRouter } from "react-router-dom"; // 👈 NUEVO

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>
);
