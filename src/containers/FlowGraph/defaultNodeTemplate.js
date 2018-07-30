import * as React from "react";
import { PortWrapper } from "../../lib/Graph";
import { withStyles } from "@material-ui/core/styles";
import { observer } from "mobx-react";
import classnames from "classnames";

const nodeRowWidth = 200;
const nodeRowHeight = 25;
const portSize = 10;
const nodeRowOffset = nodeRowHeight / 2 - portSize / 2;
const borderRadius = 3;
const inPortXOffset = 0;
const outPortXOffset = nodeRowWidth - portSize;

@withStyles(theme => ({
  node: {
    fill: "#fff",
    fillOpacity: 0.5,
    zIndex: -1,
    stroke: theme.palette.grey[800],
    strokeWidth: 2,
    strokeLinecap: "round",
    cursor: "grab"
  },

  nodeSelected: {
    stroke: theme.palette.primary.main
  },

  nodeDragging: {
    cursor: "grabbing"
  },

  port: {
    width: `${portSize}px`,
    height: `${portSize}px`,
    fill: theme.palette.grey[800]
  },

  portLabel: {
    fontSize: "10px",
    lineHeight: `1`,
    fontWeight: "bolder"
  }
}))
@observer
class DefaultNodeTemplate extends React.Component {
  render() {
    const { node, handlers, classes, selected, dragging } = this.props;

    const inPorts = node.ports.filter(port => port.type === "input");
    const outPorts = node.ports.filter(port => port.type === "output");

    const verticalPortCount = Math.max(inPorts.length, outPorts.length);

    return (
      <svg
        {...handlers}
        xmlns="http://www.w3.org/2000/svg"
        x={node.position.x}
        y={node.position.y}
      >
        <rect
          rx={borderRadius}
          ry={borderRadius}
          x={0}
          width={nodeRowWidth}
          height={verticalPortCount * nodeRowHeight}
          className={classnames(classes.node, {
            [classes.nodeSelected]: selected,
            [classes.nodeDragging]: dragging
          })}
        />

        {inPorts.map((port, i) => {
          return (
            <React.Fragment key={port.id}>
              <PortWrapper
                port={port}
                renderPort={({ port, handlers }) => (
                  <rect
                    className={classes.port}
                    x={inPortXOffset}
                    y={i * nodeRowHeight + nodeRowOffset}
                    {...handlers}
                  />
                )}
              />

              <text
                x={inPortXOffset + portSize * 2}
                y={i * nodeRowHeight + nodeRowOffset + 9}
                className={classes.portLabel}
                textAnchor="start"
              >
                {port.data.label || ""}
              </text>
            </React.Fragment>
          );
        })}

        {outPorts.map((port, i) => {
          return (
            <React.Fragment key={port.id}>
              <PortWrapper
                port={port}
                renderPort={({ port, handlers }) => (
                  <rect
                    className={classes.port}
                    x={outPortXOffset}
                    y={i * nodeRowHeight + nodeRowOffset}
                    {...handlers}
                  />
                )}
              />

              <text
                x={outPortXOffset - portSize}
                y={i * nodeRowHeight + (nodeRowOffset + 9)}
                className={classes.portLabel}
                textAnchor="end"
              >
                {port.data.label || ""}
              </text>
            </React.Fragment>
          );
        })}
      </svg>
    );
  }
}

export const defaultNodeTemplate = {
  renderNode: props => {
    return <DefaultNodeTemplate {...props} />;
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
  }
};
