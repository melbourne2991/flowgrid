import { GraphNode, GraphNodeParams } from "./store/GraphNode";
import { GraphNodePort } from "./store";
import { GraphNodePortParams } from "./store/GraphNodePort";
import { ConnectionParams, Connection } from "./store/Connection";
import { NewConnectionParams, NewConnection } from "./store/NewConnection";

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

export type Point = {
  x: number;
  y: number;
};

export type GraphObjectTypes = {
  GraphNode: {
    params: GraphNodeParams;
    type: GraphNode;
  };
  GraphNodePort: {
    params: GraphNodePortParams;
    type: GraphNodePort;
  };
  Connection: {
    params: ConnectionParams;
    type: Connection;
  };
  NewConnection: {
    params: NewConnectionParams;
    type: NewConnection;
  };
};
