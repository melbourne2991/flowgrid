import React from "react";
import { withStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import { DragSource } from "react-dnd";
import { observer } from "mobx-react";

const sourceSpec = {
  beginDrag(props) {
    return props.nodeType;
  },

  endDrag(props) {}
};

@withStyles(theme => ({
  nodeContainer: {
    paddingBottom: `${theme.spacing.unit * 2}px`
  },

  node: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${theme.spacing.unit}px`,
    borderRadius: `${theme.shape.borderRadius}px`,
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  }
}))
@DragSource("node", sourceSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@observer
export class NodeType extends React.Component {
  render() {
    const { classes, nodeType, connectDragSource } = this.props;

    return connectDragSource(
      <div className={classes.nodeContainer} key={nodeType.config.name}>
        <div className={classes.node}>
          <Typography color={"inherit"} variant="subheading">
            {nodeType.config.name}
          </Typography>
        </div>
      </div>
    );
  }
}
