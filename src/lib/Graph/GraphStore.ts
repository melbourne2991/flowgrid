import { observable, action } from "mobx";
import { types } from "mobx-state-tree";
import * as uniqid from "uniqid";

import {
  createGraphModel,
  createNodeModel,
  createPortModel,
  createConnectionModel,
  createNewConnectionModel
} from "./models";

import { IGraph, IGraphNode } from "./types";

let GraphModel: any;
let NodeModel: any;
let PortModel: any;
let ConnectionModel: any;
let NewConnectionModel: any;

PortModel = createPortModel(
  types.late(() => NodeModel),
  types.late(() => PortModel),
  types.late(() => NewConnectionModel)
);

NodeModel = createNodeModel(PortModel);
NewConnectionModel = createNewConnectionModel(PortModel);
ConnectionModel = createConnectionModel(PortModel);

GraphModel = createGraphModel(
  NodeModel,
  PortModel,
  ConnectionModel,
  NewConnectionModel
);

export class GraphStore {
  @observable graph: IGraph;

  @observable canvasLocked: boolean = false;

  svgMatrix: SVGMatrix;
  svgPoint: SVGPoint;

  constructor() {
    this.graph = GraphModel.create(
      {
        nodes: [],
        ports: [],
        connections: [],
        newConnection: null
      },
      this
    );
  }

  @action
  lockCanvas() {
    this.canvasLocked = true;
  }

  @action
  unlockCanvas() {
    this.canvasLocked = false;
  }

  addNode(template: string, data: {}): IGraphNode {
    const nodeId = uniqid();

    const node = NodeModel.create(
      {
        id: nodeId,
        ports: [],
        template,
        data,
        x: 0,
        y: 0
      },
      this
    );

    this.graph.addNode(node);

    return node;
  }

  addPortToNode(node: any, data: {} = {}) {
    const portId = uniqid();

    const port = PortModel.create(
      {
        id: portId,
        node: node.id,
        connectedPorts: [],
        data
      },
      this
    );

    this.graph.addPortToNode(node, port);

    return port;
  }

  clientToSvgPos = (x: number, y: number): { x: number; y: number } => {
    this.svgPoint.x = x;
    this.svgPoint.y = y;

    return this.svgPoint.matrixTransform(this.svgMatrix.inverse());
  };

  clientDeltaToSvg(deltaX: number, deltaY: number) {
    return {
      x: deltaX / this.svgMatrix.a,
      y: deltaY / this.svgMatrix.d
    };
  }
}
