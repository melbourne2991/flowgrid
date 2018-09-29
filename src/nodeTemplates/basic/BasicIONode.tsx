import * as React from "react";
import { observer } from "mobx-react";

import { IGraphNodePort } from "../../lib/Graph";
import { SVGRenderContext } from "../../lib/Graph/SvgRenderContext";

import { BasicIONodePortProps } from "./BasicIONodePort";
import { BasicIONodeTemplate } from "./index";

import {
  makeNode,
  GraphNodeInternalProps
} from "../../lib/Graph/hocs/makeNode";

type BasicIONodeInternalProps = GraphNodeInternalProps;

export function createBasicIONodeRenderer(
  template: BasicIONodeTemplate,
  Port: React.ComponentType<BasicIONodePortProps>
) {
  @observer
  class BasicIONodeComponent extends React.Component<BasicIONodeInternalProps> {
    onMouseDown = (e: React.MouseEvent<SVGRectElement>) => {
      this.props.selectNode();
      this.props.startDragging(e);
    };

    mapPorts = (ports: IGraphNodePort[]) => {
      return ports.map((port: IGraphNodePort) => {
        const portDimensions = template.getPortDimensions(port);

        return (
          <Port key={port.id} port={port} portDimensions={portDimensions} />
        );
      });
    };

    getNodeStyle() {
      const { node } = this.props;

      const base = {
        fill: "#e6e6e6",
        zIndex: -1,
        cursor: "grab"
      };

      if (node.selected) {
        return {
          ...base,
          fill: "#fff"
        };
      }

      if (node.dragging) {
        return {
          ...base,
          cursor: "grabbing"
        };
      }

      return base;
    }

    render() {
      const { node } = this.props;

      const inPorts = node.ports.filter(port => port.data.type === "input");
      const outPorts = node.ports.filter(port => port.data.type === "output");

      const verticalPortCount = Math.max(inPorts.length, outPorts.length);
      const hasCanvas = node.data.canvas;

      return (
        <svg xmlns="http://www.w3.org/2000/svg" x={node.x} y={node.y}>
          <rect
            x={0}
            onMouseDown={this.onMouseDown}
            rx={template.templateParams.borderRadius}
            ry={template.templateParams.borderRadius}
            width={template.templateParams.nodeWidth}
            height={verticalPortCount * template.templateParams.portRowHeight}
            style={this.getNodeStyle()}
          />

          {this.mapPorts(inPorts)}
          {this.mapPorts(outPorts)}

          {hasCanvas && (
            <SVGRenderContext x={node.x} y={node.y}>
              {({ style }) => {
                return <div style={style}>Hello ello</div>;
              }}
            </SVGRenderContext>
          )}
        </svg>
      );
    }
  }

  return makeNode(BasicIONodeComponent);
}
