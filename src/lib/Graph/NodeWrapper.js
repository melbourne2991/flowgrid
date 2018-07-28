import React from "react";
import { observer } from "mobx-react";
import { Draggable } from "./Draggable";

@observer
export class NodeWrapper extends React.Component {
  handleDrag = (e, data) => {
    this.props.node.updatePositionWithDelta(data.deltaX, data.deltaY);
  };

  renderNode = ({ draggableHandlers }) => {
    return this.props.renderNode(this.props.node, draggableHandlers);
  };

  render() {
    return (
      <Draggable
        render={this.renderNode}
        store={this.props.node.draggable}
        onDrag={this.handleDrag}
      />
    );
  }
}
