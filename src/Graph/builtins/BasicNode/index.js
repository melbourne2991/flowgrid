import React from "react";
import { PortWrapper } from "../../PortWrapper";
import { withStyle } from "../../../util";
import { css } from "emotion";

const nodeRowWidth = 200;
const nodeRowHeight = 25;
const portSize = 10;
const nodeRowOffset = nodeRowHeight / 2 - portSize / 2;

const Port = withStyle({
  width: `${portSize}px`,
  height: `${portSize}px`,
  background: "#000"
})("rect");

export const BasicNode = {
  renderNode: (node, draggableHandlers) => {
    return (
      <svg
        {...draggableHandlers}
        xmlns="http://www.w3.org/2000/svg"
        x={node.position.x}
        y={node.position.y}
      >
        <rect
          x={0}
          width={nodeRowWidth}
          height={node.ports.length * nodeRowHeight}
          className={css({
            fill: "#ccc",
            zIndex: -1
          })}
        />

        {node.ports.map((port, i) => {
          return (
            <React.Fragment key={port.id}>
              <PortWrapper
                port={port}
                renderPort={(port, draggableHandlers) => (
                  <Port
                    x={0}
                    y={i * nodeRowHeight + nodeRowOffset}
                    {...draggableHandlers}
                  />
                )}
              />
            </React.Fragment>
          );
        })}
      </svg>
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
