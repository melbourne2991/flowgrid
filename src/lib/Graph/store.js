import { observable, action } from "mobx";
import shortid from "shortid";

export class SelectableStore {
  @observable selected = false;

  constructor() {}

  @action.bound
  select() {
    this.selected = true;
  }

  @action.bound
  deselect() {
    this.selected = false;
  }
}

export class DraggableStore {
  @observable dragging = false;

  @observable lastX = null;
  @observable lastY = null;

  @observable x = null;
  @observable y = null;

  constructor(canvas) {
    this.canvas = canvas;
  }

  @action
  start(x, y) {
    this.canvas.locked = true;
    this.dragging = true;

    this.lastX = x;
    this.lastY = y;

    this.x = x;
    this.y = y;
  }

  @action
  drag(x, y) {
    this.lastX = this.x;
    this.lastY = this.y;

    this.x = x;
    this.y = y;

    const deltaX = this.x - this.lastX;
    const deltaY = this.y - this.lastY;

    const result = {
      x,
      y,
      deltaX,
      deltaY
    };

    return result;
  }

  @action
  stop() {
    this.canvas.locked = false;
    this.dragging = false;
    this.lastX = null;
    this.lastY = null;
    this.x = null;
    this.y = null;
  }
}

export class NewConnection {
  constructor(id, sourcePort) {
    this.id = id;
    this.sourcePort = sourcePort;
    this.delta = {
      x: 0,
      y: 0
    };
  }

  @observable sourcePort = null;

  @observable
  delta = {
    x: 0,
    y: 0
  };
}

export class GraphNodePort {
  id;
  node;

  @observable connectedPorts = [];
  @observable newConnection = null;
  @observable data = {};

  constructor(id, node, type = "basic", data = {}) {
    this.node = node;
    this.id = id;
    this.type = type;
    this.data = data;

    this.draggable = new DraggableStore(this.node.graph.canvas);
  }

  @action
  beginNewConnection = () => {
    this.newConnection = this.node.graph.beginNewConnection(this);
  };

  @action
  updateNewConnection = (deltaX, deltaY) => {
    this.newConnection.delta.x += deltaX / this.node.graph.canvas.CTM.a;
    this.newConnection.delta.y += deltaY / this.node.graph.canvas.CTM.d;
  };

  @action
  cancelNewConnection = () => {
    this.node.graph.cancelNewConnection();
    this.newConnection = null;
  };

  @action
  handlePotentialConnection = () => {
    this.node.graph.handlePotentialConnection(this);
  };
}

export class GraphNode {
  id;
  graph;

  @observable ports = [];
  @observable
  position = {
    x: 0,
    y: 0
  };

  @observable data = {};

  constructor(id, graph, type = "basic", data = {}) {
    this.type = type;
    this.graph = graph;
    this.id = id;
    this.data = data;

    this.position.x = this.graph.canvas.canvasCenterX;
    this.position.y = this.graph.canvas.canvasCenterY;
    this.draggable = new DraggableStore(this.graph.canvas);
    this.selectable = new SelectableStore();
  }

  @action
  addPort = (type, data) => {
    const port = new GraphNodePort(shortid.generate(), this, type, data);
    this.ports.push(port);
    return port;
  };

  @action
  updatePositionWithDelta = (deltaX, deltaY) => {
    this.position.x += deltaX / this.graph.canvas.CTM.a;
    this.position.y += deltaY / this.graph.canvas.CTM.d;
  };

  @action
  updatePositionWithClientOffset = (clientX, clientY) => {
    const svgPos = this.graph.canvas.clientToSVGPoint(clientX, clientY);

    this.position.x = svgPos.x;
    this.position.y = svgPos.y;
  };
}

export class CanvasStore {
  SVGPoint = null;

  @observable translate;
  @observable scale = 1;

  // Had to introduce this as a means
  // of getting panning to play nicely with dragging
  // elements around - stopPropagation / stopImmediatePop
  // was not working.
  locked = false;

  CTM = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0
  };

  constructor({
    canvasWidth,
    canvasHeight,
    canvasWindowWidth,
    canvasWindowHeight
  }) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.canvasWindowWidth = canvasWindowWidth;
    this.canvasWindowHeight = canvasWindowHeight;

    this.canvasCenterX = this.canvasWidth / 2;
    this.canvasCenterY = this.canvasHeight / 2;
  }

  clientToSVGPoint(clientX, clientY) {
    this.SVGPoint.x = clientX;
    this.SVGPoint.y = clientY;

    return this.SVGPoint.matrixTransform(this.CTM.inverse());
  }
}

class Connection {
  @observable ports = [];

  constructor(id, ...ports) {
    this.id = id;
    this.ports = ports;
  }
}

export class GraphStore {
  @observable nodes = [];
  @observable newConnection = null;
  @observable connections = [];

  constructor({ canvas, config }) {
    this.canvas = canvas;
    this.config = config;
  }

  @action
  addNode(type, data) {
    const node = new GraphNode(shortid.generate(), this, type, data);
    this.nodes.push(node);
    return node;
  }

  @action
  beginNewConnection(sourcePort) {
    const newConnection = new NewConnection(shortid.generate(), sourcePort);
    this.newConnection = newConnection;
    return newConnection;
  }

  @action
  connectPorts(portA, portB) {
    const connection = new Connection(shortid.generate(), portA, portB);

    this.connections.push(connection);

    portA.connectedPorts.push(portA);
    portB.connectedPorts.push(portB);

    return connection;
  }

  @action
  handlePotentialConnection(destinationPort) {
    if (!this.newConnection) return; // User is just mousing over, not an incoming connection

    const { sourcePort } = this.newConnection;

    if (sourcePort === destinationPort) return; // Trying to connect to itself, abort!

    const connectionCancelled =
      this.config.handlers.onNewConnection &&
      !this.config.handlers.onNewConnection(sourcePort, destinationPort);

    if (connectionCancelled) return; // Connection rejected by consumer

    this.connectPorts(sourcePort, destinationPort);
    this.newConnection = null;
  }

  @action
  cancelNewConnection() {
    this.newConnection = null;
  }
}
