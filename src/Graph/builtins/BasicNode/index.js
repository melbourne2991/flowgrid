import React from "react";
import { PortWrapper } from "../../PortWrapper";
import { withStyle } from "../../../util";
import { css } from "emotion";

const nodeRowWidth = 200;
const nodeRowHeight = 25;
const portSize = 10;
const nodeRowOffset = nodeRowHeight / 2 - portSize / 2;
const borderRadius = 3;
const inPortXOffset = 0;
const outPortXOffset = nodeRowWidth - portSize;

const Port = withStyle({
  width: `${portSize}px`,
  height: `${portSize}px`,
  background: "#000"
})("rect");

export const BasicNode = {
  renderNode: (node, draggableHandlers) => {
    const inPorts = node.ports.filter(port => port.type === "input");
    const outPorts = node.ports.filter(port => port.type === "output");

    const verticalPortCount = Math.max(inPorts.length, outPorts.length);

    return (
      <svg
        {...draggableHandlers}
        xmlns="http://www.w3.org/2000/svg"
        x={node.position.x}
        y={node.position.y}
      >
        <rect
          x={0}
          rx={borderRadius}
          ry={borderRadius}
          width={nodeRowWidth}
          height={verticalPortCount * nodeRowHeight}
          className={css({
            fill: "#fff",
            opacity: 0.5,
            zIndex: -1
          })}
        />

        {inPorts.map((port, i) => {
          return (
            <React.Fragment key={port.id}>
              <PortWrapper
                port={port}
                renderPort={(port, draggableHandlers) => (
                  <Port
                    x={inPortXOffset}
                    y={i * nodeRowHeight + nodeRowOffset}
                    {...draggableHandlers}
                  />
                )}
              />
            </React.Fragment>
          );
        })}

        {outPorts.map((port, i) => {
          return (
            <React.Fragment key={port.id}>
              <PortWrapper
                port={port}
                renderPort={(port, draggableHandlers) => (
                  <Port
                    x={outPortXOffset}
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
    const { node, type, data } = port;

    // flex line expects position to be center of the port
    const xOffset =
      type === "input" ? portSize / 2 : outPortXOffset + portSize / 2;
    const yOffset = nodeRowHeight * data.index + nodeRowHeight / 2;

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
  },

  portTypes: {
    input: {
      getBounds: () => {}
    },

    output: {
      getBounds: () => {}
    }
  }
};
