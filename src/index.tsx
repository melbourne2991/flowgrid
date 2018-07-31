import "@babel/polyfill";
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

const rootElement = document.getElementById("root");
let stores = createStores({ nodeTypes });

let serialized;

(window as any).runSerialize = () => {
  serialized = stores.rootStore.serialize();
};

(window as any).runDeserialize = () => {
  stores = createStores({ nodeTypes });
  stores.rootStore.deserialize(serialized);
  render(stores);
};

render(stores);

function render(stores) {
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

  ReactDOM.render(<Root />, rootElement);
}
