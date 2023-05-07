import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { theme } from "@config/theme";
// import store from "./redux/store/store";
import { ThemeProvider } from "styled-components";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configAxios } from "@config/axios";
import { QueryClientProvider } from "react-query";
import { configReactQuery } from "@config/react-query";
import { persistor, store } from "@app/store";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
// console.log(store.);k
configAxios(store);
const qc = configReactQuery({ store });
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter basename={import.meta.env.PUBLIC_URL}>
            <QueryClientProvider client={qc}>
              <App />
            </QueryClientProvider>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
