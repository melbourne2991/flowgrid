import * as React from "react";
import * as ReactDOM from "react-dom";
import { NodeTemplateProps, IGraphNodePort, IGraph } from "../../lib/Graph";
import { observer, inject } from "mobx-react";
import * as classnames from "classnames";
import { withStyles, StyledComponentProps } from "@material-ui/core";
import { Port, PortInternalProps } from "../../lib/Graph/components/Port";
import { GraphStore } from "../../lib/Graph/GraphStore";
import { trace } from "mobx";
import * as Color from "color";

const nodeRowWidth = 200;
const nodeRowHeight = 50;
const portSize = 10;
const nodeRowOffset = nodeRowHeight / 2 - portSize / 2;
const borderRadius = 3;

const inPortXOffset = 0;
const outPortXOffset = nodeRowWidth - portSize;

type ClassNames =
  | "node"
  | "nodeSelected"
  | "nodeDragging"
  | "port"
  | "portLabel";

const injectStyles = withStyles<ClassNames>((theme: any) => {
  const borderColor = theme.palette.grey[800];

  return {
    node: {
      fill: "#e6e6e6",
      zIndex: -1,
      cursor: "grab"
    },

    nodeSelected: {
      fill: "#fff"
    },

    nodeDragging: {
      cursor: "grabbing"
    },

    port: {
      width: `${portSize}px`,
      height: `${portSize}px`
    },

    portLabel: {
      fontSize: "10px",
      lineHeight: `1`,
      fontWeight: "bolder"
    }
  };
});

@observer
class BasicTemplateComponent extends React.Component<
  NodeTemplateProps & StyledComponentProps<ClassNames>
> {
  onMouseDown = (e: React.MouseEvent<SVGRectElement>) => {
    this.props.node.select();
    this.props.startDragging(e);
  };

  mapPorts = (ports: IGraphNodePort[], offset: number) => {
    const { classes } = this.props;

    return ports.map((port: IGraphNodePort, i: number) => {
      const dimensions = {
        input: {
          x: inPortXOffset,
          y: i * nodeRowHeight + nodeRowOffset,
          text: {
            x: inPortXOffset + portSize * 2,
            y: i * nodeRowHeight + nodeRowOffset + 9,
            textAnchor: "start"
          }
        },

        output: {
          x: outPortXOffset,
          y: i * nodeRowHeight + nodeRowOffset,
          text: {
            x: outPortXOffset - portSize,
            y: i * nodeRowHeight + (nodeRowOffset + 9),
            textAnchor: "end"
          }
        }
      };

      let fillOverride = "#ccc";

      if (
        port.newConnectionProximity !== false &&
        port.newConnectionProximity < 100
      ) {
        fillOverride = Color("#424242")
          .lighten(port.newConnectionProximity / 100)
          .hex();
      }

      return (
        <Port port={port} key={port.id}>
          {(props: PortInternalProps) => {
            const portDimensions = (dimensions as any)[port.data.type];

            return (
              <React.Fragment>
                <rect
                  fill={fillOverride}
                  shapeRendering="crispEdges"
                  className={classes!.port}
                  x={portDimensions.x}
                  y={portDimensions.y}
                  onMouseDown={e => {
                    e.stopPropagation();
                    props.startDragging(e);
                  }}
                  onMouseUp={e => {
                    props.requestConnection(e);
                  }}
                />

                <text className={classes!.portLabel} {...portDimensions.text}>
                  {port.data.label || "s"}
                </text>
              </React.Fragment>
            );
          }}
        </Port>
      );
    });
  };

  render() {
    const { node, classes, dragging } = this.props;

    const inPorts = node.ports.filter(port => port.data.type === "input");
    const outPorts = node.ports.filter(port => port.data.type === "output");

    const verticalPortCount = Math.max(inPorts.length, outPorts.length);

    return (
      <svg xmlns="http://www.w3.org/2000/svg" x={node.x} y={node.y}>
        <rect
          onMouseDown={this.onMouseDown}
          rx={borderRadius}
          ry={borderRadius}
          x={0}
          width={nodeRowWidth}
          height={verticalPortCount * nodeRowHeight}
          className={classnames(classes!.node, {
            [classes!.nodeSelected!]: node.selected,
            [classes!.nodeDragging!]: dragging
          })}
        />

        {this.mapPorts(inPorts, inPortXOffset)}
        {this.mapPorts(outPorts, outPortXOffset)}

        <SVGRenderContext x={node.x} y={node.y}>
          {({ style }) => {
            return <div style={style}>Hello ello</div>;
          }}
        </SVGRenderContext>
      </svg>
    );
  }
}

const SVGRenderContext: React.SFC<{
  x: number;
  y: number;
  children: (
    {
      style: {}
    }
  ) => React.ReactElement<any>;
}> = inject("graphStore")(
  observer(function SVGRenderContext({ children, graphStore, x, y }) {
    const domCanvas = document.getElementById("dom-canvas");
    const clientPos = (graphStore as GraphStore).svgToClientPos(x, y);

    if (domCanvas) {
      const matrix = clientPos.matrix as SVGMatrix;

      const transform = `matrix(${matrix.a}, ${matrix.b}, ${matrix.c}, ${
        matrix.d
      }, ${clientPos.x}, ${clientPos.y})`;

      const style = {
        position: "absolute",
        top: 0,
        left: 0,
        transformOrigin: "top left",
        transform
      };

      return ReactDOM.createPortal(
        (children as any)({
          style
        }),
        domCanvas
      ) as any;
    }

    return null;
  })
) as any;

const BasicTemplate = injectStyles<NodeTemplateProps>(
  BasicTemplateComponent as any
);

export const basic = {
  renderNode: BasicTemplate,
  getPortBounds(port: IGraphNodePort) {
    const { node, data } = port;

    // flex line expects position to be center of the port
    const xOffset =
      data.type === "input" ? portSize / 2 : outPortXOffset + portSize / 2;
    const yOffset = nodeRowHeight * data.index + nodeRowHeight / 2;

    const x = node.x + xOffset;
    const y = node.y + yOffset;

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
