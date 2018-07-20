import React from "react";
import { observer, inject } from "mobx-react";
import { Port } from "./Port";
import { Draggable } from "./Draggable";
import { withStyle } from "../util";

const nodeRowWidth = 200;
const nodeRowHeight = 50;

export const NodeRow = withStyle({
  display: "flex",
  alignItems: "center",
  background: "rgba(0,0,0,.05)",
  borderBottom: "1px solid rgba(34,36,38,.15)",
  width: `${nodeRowWidth}px`,
  height: `${nodeRowHeight}px`
})("div");

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
            transform,
            position: "absolute"
          }}
        >
          <div className={"ports"}>
            {this.props.node.ports.map(port => {
              return (
                <NodeRow key={port.id}>
                  <Port port={port} />
                </NodeRow>
              );
            })}
          </div>
        </div>
      </Draggable>
    );
  }
}
