import "./styles.css";

import React from "react";
import ReactDOM from "react-dom";
import { App } from "./containers/App";
import { Provider } from "mobx-react";
import { createStores } from "./stores";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "./theme";

function Root() {
  return (
    <Provider {...createStores()}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </MuiThemeProvider>
    </Provider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Root />, rootElement);
