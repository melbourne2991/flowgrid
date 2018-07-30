import { GraphNode } from "./store/GraphNode";
import { GraphNodePort } from "./store";

export type GraphNodeType = {
  renderNode(props: {
    node: GraphNode;
    handlers: any;
    selected: boolean;
    dragging: boolean;
  }): React.ReactElement<any>;

  getPortBounds(
    port: GraphNodePort
  ): {
    position: {
      x: number;
      y: number;
    };
    extents: number;
  };
};

export interface GraphConfig {
  canvas: {};
  nodeTypes: {
    [nodeType: string]: GraphNodeType;
  };
  handlers: {
    onNewConnection?(
      sourcePort: GraphNodePort,
      destinationPort: GraphNodePort
    ): void;
  };
}
