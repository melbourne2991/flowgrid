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
  };

  handleStop = (e, data) => {
    e.stopPropagation();
  };

  handleDrag = (e, data) => {
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
