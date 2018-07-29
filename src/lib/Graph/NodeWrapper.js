import React from "react";
import { observer } from "mobx-react";
import { makeDraggable } from "./Draggable";

@makeDraggable(props => ({
  store: props.node.draggable,

  onDrag: (e, data) => {
    props.node.updatePositionWithDelta(data.deltaX, data.deltaY);
  }
}))
@observer
export class NodeWrapper extends React.Component {
  render() {
    return this.props.renderNode(this.props.node, this.props.draggableHandlers);
  }
}
