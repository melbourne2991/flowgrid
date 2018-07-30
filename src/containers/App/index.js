import * as React from "react";
import { FlowGraph } from "../FlowGraph";
import { withStyles } from "@material-ui/core/styles";
import { TopBar } from "./TopBar";
import { observer } from "mobx-react";

const styles = theme => ({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },

  main: {
    width: "100%",
    display: "flex",
    position: "relative",
    flex: 1
  },

  topBar: {
    alignSelf: "flex-start"
  }
});

@withStyles(styles)
@observer
export class App extends React.Component {
  render() {
    return (
      <div className={this.props.classes.root}>
        <TopBar className={this.props.classes.topBar} />

        <main className={this.props.classes.main}>
          <FlowGraph />
        </main>
      </div>
    );
  }
}
