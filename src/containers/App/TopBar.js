import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

export const TopBar = props => {
  return (
    <AppBar position="static" {...props}>
      <Toolbar variant="dense">
        <Typography variant="title" color="inherit">
          Welcome
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
