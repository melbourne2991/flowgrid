import React from "react";
import { PortWrapper } from "../PortWrapper";
import { withStyle } from "../../util";

const nodeRowWidth = 200;
const nodeRowHeight = 25;
const portSize = 10;

const NodeRow = withStyle({
  display: "flex",
  alignItems: "center",
  background: "rgba(0,0,0,.05)",
  borderBottom: "1px solid rgba(34,36,38,.15)",
  width: `${nodeRowWidth}px`,
  height: `${nodeRowHeight}px`
})("div");

const Port = withStyle({
  width: `${portSize}px`,
  height: `${portSize}px`,
  background: "#000"
})("div");

export const BasicNode = {
  renderNode: node => {
    const transform = `translate(${node.position.x}px, ${node.position.y}px)`;

    return (
      <div
        style={{
          transform,
          position: "absolute"
        }}
      >
        <div className={"ports"}>
          {node.ports.map(port => {
            return (
              <NodeRow key={port.id}>
                <PortWrapper port={port} renderPort={() => <Port />} />
              </NodeRow>
            );
          })}
        </div>
      </div>
    );
  },

  getPortBounds(port) {
    const { node, index } = port;

    // flex line expects position to be center of the port
    const xOffset = portSize / 2;
    const yOffset = nodeRowHeight * index + nodeRowHeight / 2;

    const x = node.position.x + xOffset;
    const y = node.position.y + yOffset;

    return {
      position: {
        x,
        y
      },

      // extents is half size
      extents: portSize / 2
    };
  }
};
