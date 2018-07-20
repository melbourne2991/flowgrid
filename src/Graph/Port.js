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
  };

  handleDrag = (e, data) => {
    this.props.port.updateNewConnection(data.deltaX, data.deltaY);
    e.stopPropagation();
  };

  render() {
    return (
      <Draggable
        store={this.props.port.draggable}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
      >
        <div {...this.props} />
      </Draggable>
    );
  }
}
