import { observable, action } from "mobx";
import * as uniqid from "uniqid";
import makeInspectable from "mobx-devtools-mst";

import {
  IGraph,
  IGraphNode,
  Point,
  IGraphNodePort,
  NodeTemplate,
  IGraphConnection
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
import { KeyTrackerStore } from "./KeyTracker/KeyTracker";
import { bindKeyEvents } from "./bindKeyEvents";
import { defaultKeyBindings, KeyBindings } from "./defaultKeyBindings";

export { NodeModel, NewConnectionModel, ConnectionModel, GraphModel };

export interface GraphStoreParams {
  engine: GraphEngine;
  env: {
    graphStore(): GraphStore;
  };
}

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

  keyTracker: KeyTrackerStore;
  keyBindings: KeyBindings;

  env: any;

  constructor(params: GraphStoreParams) {
    params.engine.graphStore = this;

    this.env = params.env;
    this.engine = params.engine;
    this.keyBindings = defaultKeyBindings;
    this.keyTracker = new KeyTrackerStore();

    this.graph = GraphModel.create(
      {
        nodes: [],
        ports: [],
        connections: [],
        selected: [],
        newConnection: null,
        selectionMode: "single"
      },
      this.env
    );

    makeInspectable(this.graph);

    this.undoManager = setUndoManager(this.graph);

    bindKeyEvents(this);
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
  removeNode(node: IGraphNode) {
    // Clear all connections first.
    this.graph.connections.forEach(connection => {
      if (connection.source.node === node || connection.target.node === node) {
        this.removeConnection(connection);
      }
    });

    this.graph.deselect(node);
    this.graph.removeNode(node);
  }

  @action
  removeConnection(connection: IGraphConnection) {
    this.graph.deselect(connection);
    this.graph.removeConnection(connection);
  }

  @action
  addNode(template: NodeTemplate, data: {}, id: string): IGraphNode {
    const node = NodeModel.create(
      {
        id: id || uniqid(),
        ports: [],
        template,
        data,
        x: 0,
        y: 0,
        dragging: false
      },
      this.env
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
      this.env
    );

    this.graph.addPortToNode(node, port);

    return port;
  }

  findClosestNodeToPoint(nodes: IGraphNode[], point: Point) {
    return nodes.slice().sort((a, b) => {
      const portADistance = pointDistance(point, a);
      const portBDistance = pointDistance(point, b);

      return portADistance - portBDistance;
    })[0];
  }

  findClosestPortToPoint(ports: IGraphNodePort[], point: Point) {
    const sortedPorts = ports.slice().sort((a, b) => {
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
