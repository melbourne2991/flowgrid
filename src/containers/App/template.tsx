import * as React from "react";
import { NodeTemplateProps, IGraphNodePort } from "../../lib/Graph";
import { observer } from "mobx-react";
import * as classnames from "classnames";
import { withStyles, StyledComponentProps } from "@material-ui/core";
import { Port, PortInternalProps } from "../../lib/Graph/components/Port";

const nodeRowWidth = 200;
const nodeRowHeight = 25;
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

const injectStyles = withStyles<ClassNames>((theme: any) => ({
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
}));

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
      return (
        <Port port={port} key={port.id}>
          {(props: PortInternalProps) => {
            return (
              <rect
                className={classes!.port}
                x={offset}
                y={i * nodeRowHeight + nodeRowOffset}
                onMouseDown={e => {
                  e.stopPropagation();
                  props.startDragging(e);
                }}
              />
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
      </svg>
    );
  }
}

export const BasicTemplate = injectStyles<NodeTemplateProps>(
  BasicTemplateComponent as any
);
