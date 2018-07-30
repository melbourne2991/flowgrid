import { GraphNode } from "./store/GraphNode";
import { GraphNodePort } from "./store";

export type GraphNodeTemplate = {
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
  nodeTemplates: {
    [nodeTemplate: string]: GraphNodeTemplate;
  };
  handlers: {
    onNewConnection?(
      sourcePort: GraphNodePort,
      destinationPort: GraphNodePort
    ): void;
  };
}
