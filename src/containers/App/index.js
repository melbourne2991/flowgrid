import * as React from "react";
import { FlowGraph } from "../FlowGraph";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

@withStyles(styles)
export class App extends React.Component {
  render() {
    return (
      <div className={this.props.classes.root}>
        <FlowGraph />
      </div>
    );
  }
}
