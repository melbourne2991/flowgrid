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
    this.props.port.cancelNewConnection();
  };

  handleDrag = (e, data) => {
    this.props.port.updateNewConnection(data.deltaX, data.deltaY);
  };

  handleMouseUp = e => {
    this.props.port.handlePotentialConnection();
  };

  renderPort = ({ draggableHandlers }) => {
    return this.props.renderPort(this.props.port, {
      ...draggableHandlers,
      onMouseUp: this.handleMouseUp
    });
  };

  render() {
    return (
      <Draggable
        render={this.renderPort}
        store={this.props.port.draggable}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
      />
    );
  }
}
