import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./containers/App";
import { Provider } from "mobx-react";
import { CssBaseline } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "./theme";

export function init(rootElement: HTMLElement, inectables: {} = {}) {
  function Root() {
    return (
      <Provider {...inectables}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </MuiThemeProvider>
      </Provider>
    );
  }

  ReactDOM.render(<Root />, rootElement);
}
