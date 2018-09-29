import { observable, action } from "mobx";
import * as uniqid from "uniqid";
import { onPatch } from "mobx-state-tree";

import {
  IGraph,
  IGraphNode,
  Point,
  IGraphNodePort,
  NodeTemplate
} from "./types";

import { setUndoManager } from "../setUndoManager";
import { pointDistance } from "./util";

import {
  NodeModel,
  NewConnectionModel,
  ConnectionModel,
  GraphModel,
  PortModel
} from "./models";
import { GraphEngine } from "./GraphEngine";

export { NodeModel, NewConnectionModel, ConnectionModel, GraphModel };

export interface GraphStoreParams {
  engine: GraphEngine;
}

const defaultParams = {
  engine: new GraphEngine()
};

export class GraphStore {
  // graph is the actual mst tree
  @observable
  graph: IGraph;

  @observable
  canvasLocked: boolean = false;

  @observable
  svgMatrix: SVGMatrix;

  @observable
  svgPoint: SVGPoint;

  engine: GraphEngine;

  undoManager: any;

  constructor(params: GraphStoreParams = defaultParams) {
    params.engine.graphStore = this;
    this.engine = params.engine;

    this.graph = GraphModel.create(
      {
        nodes: [],
        ports: [],
        connections: [],
        newConnection: null
      },
      this
    );

    this.undoManager = setUndoManager(this.graph);
  }

  @action
  lockCanvas() {
    this.canvasLocked = true;
  }

  @action
  unlockCanvas() {
    this.canvasLocked = false;
  }

  @action
  addNode(id: string, template: NodeTemplate, data: {}): IGraphNode {
    const node = NodeModel.create(
      {
        id,
        ports: [],
        template,
        data,
        x: 0,
        y: 0,
        dragging: false
      },
      this
    );

    this.graph.addNode(node);

    return node;
  }

  @action
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
    return port.node.template.getPortBounds(port);
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

  clientDeltaToSvg(deltaX: number, deltaY: number) {
    return {
      x: deltaX / this.svgMatrix.a,
      y: deltaY / this.svgMatrix.d
    };
  }

  setSvgMatrix = (ctm: { matrix: SVGMatrix; point: SVGPoint }) => {
    this.svgMatrix = ctm.matrix;
    this.svgPoint = ctm.point;
  };
}
