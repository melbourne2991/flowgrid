import * as React from "react";
import { DraggableProps } from "./makeDraggable";
import { Snapbox } from "./components/FlexLine";

export interface IGraphObject {
  id: string;
}

export interface IGraphSelectableObject extends IGraphObject {
  select(): void;
  selected: boolean;
}

export interface IGraphNodePort<T = any> {
  id: string;
  connectedPorts: IGraphNodePort<T>[];
  newConnection: IGraphNewConnection;
  newConnectionProximity: number | false;
  cancelNewConnection(): void;
  hasNewConnection(): boolean;
  beginNewConnection(): void;
  requestConnection(): void;
  updateNewConnectionProximity(distance: number | false): void;
  node: IGraphNode;
  data: T;
}

export interface IGraphNode<T = any> extends IGraphSelectableObject {
  id: string;
  ports: IGraphNodePort<any>[];

  x: number;
  y: number;

  data: T;
  template: NodeTemplate;
  updatePosition(x: number, y: number): void;
  addPort(port: IGraphNodePort<any>): void;
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
  select(obj: any): void;
}

export interface NodeTemplate {
  renderNode: React.ComponentType<NodeTemplateProps>;

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

export type NodeTemplateProps<T = any> = DraggableProps<{
  node: IGraphNode<T>;
}>;

export interface Point {
  x: number;
  y: number;
}

export type GetPortBoundsFn = (port: IGraphNodePort) => Snapbox;
