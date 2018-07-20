import React from "react";
import { Draggable } from "./Draggable";
import { observer } from "mobx-react";
import { withStyle } from "../util";

@observer
@withStyle({
  width: "10px",
  height: "10px",
  background: "#000"
})
export class Port extends React.Component {
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

  handleMouseOver = () => {
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
        onMouseOver={this.handleIncomingConnection}
      >
        <div {...this.props} />
      </Draggable>
    );
  }
}
