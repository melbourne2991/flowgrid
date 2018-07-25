import React from "react";
import { Graph } from "../../lib/Graph";
import { inject } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
  canvas: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
    background: theme.palette.grey[300],
    borderColor: theme.palette.grey[400]
  },

  sidebarWrapper: {
    ...theme.mixins.boxSpacing(),
    display: "flex",
    position: "absolute",
    right: 0,
    height: "100%",
    width: `${theme.spacing.unit * 40}px`
  },

  sidebar: {
    ...theme.mixins.gutters(),
    paddingTop: `${theme.spacing.unit * 2}px`,
    paddingBottom: `${theme.spacing.unit * 2}px`,
    flex: 1
  }
});

@inject("flowGraphStore")
@withStyles(styles)
export class FlowGraph extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className={this.props.classes.sidebarWrapper}>
          <Paper className={this.props.classes.sidebar} elevation={1}>
            <Typography variant="subheading" gutterBottom>
              Add nodes
            </Typography>
            <Divider />
          </Paper>
        </div>

        <Graph
          store={this.props.flowGraphStore.graphStore}
          className={this.props.classes.canvas}
        />
      </React.Fragment>
    );
  }
}
