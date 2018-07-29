import * as React from "react";
import { observer } from "mobx-react";
import { makeDraggable } from "./Draggable";
import { makeSelectable } from "./Selectable";

@makeSelectable(props => ({
  store: props.node.selectable
}))
@makeDraggable(props => ({
  store: props.node.draggable,

  onDrag: (e, data) => {
    props.node.updatePositionWithDelta(data.deltaX, data.deltaY);
  }
}))
@observer
export class NodeWrapper extends React.Component {
  render() {
    return this.props.renderNode({
      node: this.props.node,
      selected: this.props.selected,
      dragging: this.props.dragging,
      handlers: {
        onMouseDown: (...args) => {
          this.props.draggableHandlers.onMouseDown(...args);
          this.props.selectableHandlers.onMouseDown(...args);
        }
      }
    });
  }
}
