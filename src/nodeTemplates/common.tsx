import * as React from "react";
import { NodeTemplateProps, IGraphNodePort, Point } from "../lib/Graph";
import { Port, PortInternalProps } from "../lib/Graph/components/Port";
import { SVGRenderContext } from "../lib/Graph/SvgRenderContext";
import { GraphNode } from "../lib/Graph/components/GraphNodes";

type QueryLayoutFn = (
  id: string
) => {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface CreateNodeTemplateParams {
  layout: (node: GraphNode) => QueryLayoutFn;
  getPortBoundsFromLayout: (
    queryLayout: QueryLayoutFn
  ) => {
    position: Point;
    extents: number;
  };
}

export function createNodeTemplate<T>({ layout }: CreateNodeTemplateParams) {


  const Template = class extends React.Component<NodeTemplateProps> {
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
  };

  return Template;
}
