import * as React from "react";
import { PositionWithExtents } from "./components/FlexLine";
import { GraphNodeProps } from "./hocs/makeNode";

export type GraphObjectType = "node" | "connection" | "newconnection" | "port";

export interface IGraphObject {
  id: string;
  type: GraphObjectType;
}

export interface IGraphSelectableObject extends IGraphObject {
  select(): void;
  deselect(): void;
  selected: boolean;
}

export interface IGraphNodePort<T = any> extends IGraphObject {
  connectedPorts: IGraphNodePort<T>[];
  hasNewConnection: boolean;
  newConnection: IGraphNewConnection;
  newConnectionProximity: number | false;
  cancelNewConnection(): void;
  beginNewConnection(): void;
  requestConnection(): void;
  updateNewConnectionProximity(distance: number | false): void;
  node: IGraphNode;
  data: T;
}

export interface IGraphNode<T = any> extends IGraphSelectableObject {
  data: T;
  ports: IGraphNodePort<any>[];

  x: number;
  y: number;

  dragging: boolean;
  template: string;

  startDragging(): void;
  stopDragging(): void;

  updatePosition(x: number, y: number): void;
  addPort(port: IGraphNodePort<any>): void;

  updateData(data: T): void;
}

export interface IGraphConnection extends IGraphSelectableObject {
  source: IGraphNodePort<any>;
  target: IGraphNodePort<any>;
}

export interface IGraphNewConnection extends IGraphObject {
  source: IGraphNodePort<any>;

  x: number;
  y: number;

  // Current pointer position
  position: {
    x: number;
    y: number;
  };

  closestPort: IGraphNodePort;
  setPosition(point: Point): void;
}

export type SelectionMode = "single" | "multi";

export interface IGraph {
  nodes: IGraphNode<any>[];
  connections: IGraphConnection[];
  newConnection: IGraphNewConnection;

  selected: any;

  addNode(node: any): void;
  addPortToNode(node: any, port: any): void;
  addNewConnection<T>(source: IGraphNodePort<T>): IGraphNewConnection;
  removeNewConnection(): void;
  connectionRequest(port: IGraphNodePort): void;
  removeNode(node: any): void;
  removePort(port: any): void;
  removeConnection(connection: IGraphConnection): void;

  select(obj: IGraphSelectableObject): void;
  deselect(obj: IGraphSelectableObject): void;

  updateSelectionMode(mode: SelectionMode): void;
  selectionMode: SelectionMode;
}

export interface NodeTemplate {
  renderNode: React.ComponentType<GraphNodeProps>;

  getPortBounds(
    port: any
  ): {
    position: {
      x: number;
      y: number;
    };
    extents: number;
  };
}

export interface NodeTemplates {
  [name: string]: NodeTemplate;
}

export interface Point {
  x: number;
  y: number;
}

export type GetPortBoundsFn = (port: IGraphNodePort) => PositionWithExtents;
