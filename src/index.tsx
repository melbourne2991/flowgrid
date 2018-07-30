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

const stores = createStores({ nodeTypes });

function Root() {
  return (
    <Provider {...stores}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </MuiThemeProvider>
    </Provider>
  );
}

(window as any).runSerialize = () => {
  const serialized = stores.rootStore.serialize();
  console.log(serialized);
};

const rootElement = document.getElementById("root");
ReactDOM.render(<Root />, rootElement);
