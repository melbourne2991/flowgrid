import * as React from "react";
import { NodeTemplateProps, IGraphNodePort } from "../lib/Graph";
import { observer } from "mobx-react";
import { Port, PortInternalProps } from "../lib/Graph/components/Port";
import { SVGRenderContext } from "../lib/Graph/SvgRenderContext";

@observer
class BasicTemplateComponent extends React.Component<NodeTemplateProps> {
  onMouseDown = (e: React.MouseEvent<SVGRectElement>) => {
    this.props.node.select();
    this.props.startDragging(e);
  };

  mapPorts = (ports: IGraphNodePort[], offset: number) => {
    return ports.map((port: IGraphNodePort, i: number) => {
      return (
        <Port port={port} key={port.id}>
          {(props: PortInternalProps) => {
            return <React.Fragment />;
          }}
        </Port>
      );
    });
  };

  render() {
    const { node } = this.props;

    return (
      <svg xmlns="http://www.w3.org/2000/svg" x={node.x} y={node.y}>
        <rect onMouseDown={this.onMouseDown} x={0} />

        <SVGRenderContext x={node.x} y={node.y}>
          {({ style }) => {
            return <div style={style}>Hello ello</div>;
          }}
        </SVGRenderContext>
      </svg>
    );
  }
}

const BasicTemplate = BasicTemplateComponent;

export const canvas = {
  renderNode: BasicTemplate,
  getPortBounds(port: IGraphNodePort) {
    return {
      position: {
        x: port.node.x,
        y: port.node.y
      },

      // extents is half size
      extents: 5
    };
  }
};
