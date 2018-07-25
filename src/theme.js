import { createMuiTheme } from "@material-ui/core/styles";
import * as mixins from "./style/mixins";

const theme = createMuiTheme({
  mixins
});

Object.keys(theme.mixins).forEach(prop => {
  if (theme.mixins.hasOwnProperty(prop)) {
    const mixin = theme.mixins[prop];
    theme.mixins[prop] = (...args) => mixin(theme, ...args);
  }
});

export { theme };
