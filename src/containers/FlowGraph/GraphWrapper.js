import * as React from "react";
import { withStyles } from "@material-ui/core";
import { DropTarget } from "react-dnd";
import { Graph } from "../../lib/Graph";
import { observer } from "mobx-react";

const targetSpec = {
  drop(props, monitor, component) {
    const nodeType = monitor.getItem();
    const pos = monitor.getSourceClientOffset();

    props.addNode(nodeType, pos);
    return {};
  }
};

@withStyles(theme => ({
  canvasWrapper: {
    height: "100%",
    width: "100%"
  },

  canvas: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
    background: theme.palette.grey[300],
    borderColor: theme.palette.grey[400]
  }
}))
@DropTarget("node", targetSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
@observer
export class GraphWrapper extends React.Component {
  render() {
    const { graphStore, classes, connectDropTarget } = this.props;

    return connectDropTarget(
      <div className={classes.canvasWrapper}>
        <Graph store={graphStore} className={classes.canvas} />
      </div>
    );
  }
}
