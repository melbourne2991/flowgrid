import { observable, action, computed } from "mobx";
import { types } from "mobx-state-tree";
import * as uniqid from "uniqid";

import {
  createGraphModel,
  createNodeModel,
  createPortModel,
  createConnectionModel,
  createNewConnectionModel
} from "./models";

import {
  IGraph,
  IGraphNode,
  Point,
  NodeTemplates,
  IGraphNodePort
} from "./types";
import { setUndoManager } from "../setUndoManager";
import { pointDistance } from "./util";

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

export interface GraphStoreParams {
  nodeTemplates: NodeTemplates;
}

export class GraphStore {
  @observable
  graph: IGraph;
  @observable
  canvasLocked: boolean = false;

  @observable
  svgMatrix: SVGMatrix;
  @observable
  svgPoint: SVGPoint;

  nodeTemplates: NodeTemplates;

  constructor(params: GraphStoreParams) {
    this.nodeTemplates = params.nodeTemplates;

    this.graph = GraphModel.create(
      {
        nodes: [],
        ports: [],
        connections: [],
        newConnection: null
      },
      this
    );

    setUndoManager(this.graph);
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
        newConnectionProximity: false,
        data
      },
      this
    );

    this.graph.addPortToNode(node, port);

    return port;
  }

  clientToSvgPos = (
    x: number,
    y: number
  ): { x: number; y: number; matrix: SVGMatrix | null } => {
    if (!this.svgPoint) return { x, y, matrix: null };

    this.svgPoint.x = x;
    this.svgPoint.y = y;

    const point = this.svgPoint.matrixTransform(this.svgMatrix.inverse());

    return {
      x: point.x,
      y: point.y,
      matrix: this.svgMatrix
    };
  };

  findClosestNodeToPoint(point: Point) {
    return this.graph.nodes.slice().sort((a, b) => {
      const portADistance = pointDistance(point, a);
      const portBDistance = pointDistance(point, b);

      return portADistance - portBDistance;
    })[0];
  }

  findClosestPortToPoint(point: Point) {
    const node = this.findClosestNodeToPoint(point);

    const sortedPorts = node.ports
      .filter(port => port.connectedPorts.length === 0)
      .slice()
      .sort((a, b) => {
        const boundsA = this.getPortBounds(a);
        const boundsB = this.getPortBounds(b);

        return (
          pointDistance(boundsA.position, point) -
          pointDistance(boundsB.position, point)
        );
      });

    const closestPort = sortedPorts[0];

    if (!closestPort) return;

    const distance = pointDistance(
      this.getPortBounds(closestPort).position,
      point
    );

    return {
      closestPort,
      distance
    };
  }

  getPortBounds = (port: IGraphNodePort<any>) => {
    return this.nodeTemplates[port.node.template].getPortBounds(port);
  };

  svgToClientPos = (
    x: number,
    y: number
  ): { x: number; y: number; matrix: SVGMatrix | null } => {
    if (!this.svgPoint) return { x, y, matrix: null };

    this.svgPoint.x = x;
    this.svgPoint.y = y;

    const point = this.svgPoint.matrixTransform(this.svgMatrix);

    return {
      x: point.x,
      y: point.y,
      matrix: this.svgMatrix
    };
  };

  clientDeltaToSvg(deltaX: number, deltaY: number) {
    return {
      x: deltaX / this.svgMatrix.a,
      y: deltaY / this.svgMatrix.d
    };
  }
}
