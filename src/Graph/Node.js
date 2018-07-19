import React from "react";
// import Draggable, { DraggableCore } from "react-draggable";
import { css } from "emotion";
import { observer } from "mobx-react";
import { Port } from "./Port";
import { Draggable } from "./Draggable";

@observer
export class Node extends React.Component {
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
    const { position } = this.props.node;

    const posX = position.x;
    const posY = position.y;

    const transform = `translate(${posX}px, ${posY}px)`;

    return (
      <Draggable
        store={this.props.node.draggable}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
      >
        <div
          style={{
            transform
          }}
          className={css({
            width: "150px",
            height: "150px",
            border: "2px solid"
          })}
        >
          <div className={"ports"}>
            {this.props.node.ports.map(port => {
              return <Port port={port} key={port.id} />;
            })}
          </div>
        </div>
      </Draggable>
    );
  }
}
