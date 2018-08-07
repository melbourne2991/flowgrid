import * as React from "react";
import { DraggableProps } from "./makeDraggable";

export interface IGraphObject {
  id: string;
}

export interface IGraphNodePort<T = any> {
  id: string;
  connectedPorts: IGraphNodePort<T>[];
  newConnection: IGraphNewConnection;
  cancelNewConnection(): void;
  hasNewConnection(): boolean;
  beginNewConnection(): void;
  node: IGraphNode;
  data: T;
}

export interface IGraphNode<T = any> {
  id: string;
  ports: IGraphNodePort<any>[];

  selected: boolean;
  select: () => void;

  x: number;
  y: number;

  data: T;
  template: string;
  updatePosition(x: number, y: number): void;
  addPort(port: IGraphNodePort<any>): void;
}

export interface IGraphConnection extends IGraphObject {
  source: IGraphNodePort<any>;
  destination: IGraphNodePort<any>;
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

  setDelta(point: Point): void;
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
