import React from "react";
import { Draggable } from "./Draggable";
import { css } from "emotion";
import { observer } from "mobx-react";

@observer
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
        <div
          className={css({
            width: "50px",
            height: "50px",
            background: "#000"
          })}
        />
      </Draggable>
    );
  }
}
