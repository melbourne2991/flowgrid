import React from "react";
import { Draggable } from "./Draggable";
import { observer } from "mobx-react";

@observer
export class PortWrapper extends React.Component {
  handleStart = (e, data) => {
    e.stopPropagation();

    this.props.port.beginNewConnection();
  };

  handleStop = (e, data) => {
    e.stopPropagation();

    this.props.port.cancelNewConnection();
  };

  handleDrag = (e, data) => {
    e.stopPropagation();

    this.props.port.updateNewConnection(data.deltaX, data.deltaY);
  };

  handleMouseUp = e => {
    e.stopPropagation();

    this.props.port.handlePotentialConnection();
  };

  render() {
    return (
      <Draggable
        store={this.props.port.draggable}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        onMouseUp={this.handleMouseUp}
      >
        {this.props.renderPort(this.props.port)}
      </Draggable>
    );
  }
}
