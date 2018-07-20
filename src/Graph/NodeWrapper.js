import React from "react";
import { observer } from "mobx-react";
import { Draggable } from "./Draggable";

@observer
export class NodeWrapper extends React.Component {
  handleStart = (e, data) => {
    e.stopPropagation();
  };

  handleStop = (e, data) => {
    e.stopPropagation();
  };

  handleDrag = (e, data) => {
    e.stopPropagation();
    this.props.node.updatePosition(data.deltaX, data.deltaY);
  };

  render() {
    return (
      <Draggable
        store={this.props.node.draggable}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
      >
        {this.props.renderNode(this.props.node)}
      </Draggable>
    );
  }
}
