import "./styles.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./containers/App";
import { Provider } from "mobx-react";
import { createStores } from "./stores";
import { CssBaseline } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "./theme";
import nodeTypes from "./nodeTypes";

function Root() {
  return (
    <Provider {...createStores({ nodeTypes })}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </MuiThemeProvider>
    </Provider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Root />, rootElement);
