import { observable, action, computed } from "mobx";
import shortid from "shortid";

export class DraggableStore {
  @observable dragging = false;

  @observable lastX = null;
  @observable lastY = null;

  @observable x = null;
  @observable y = null;

  @action
  start(x, y) {
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
    this.dragging = false;
    this.lastX = null;
    this.lastY = null;
    this.x = null;
    this.y = null;
  }
}

export class NewConnection {
  constructor(sourcePort) {
    this.id = shortid.generate();
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
  @observable index = null;

  @action
  beginNewConnection = () => {
    this.newConnection = this.node.graph.beginNewConnection(this);
  };

  @action
  updateNewConnection = (deltaX, deltaY) => {
    this.newConnection.delta.x += deltaX / this.node.graph.canvas.scale;
    this.newConnection.delta.y += deltaY / this.node.graph.canvas.scale;
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

  constructor(node, id, index) {
    this.index = index;
    this.node = node;
    this.id = id;
    this.draggable = new DraggableStore();
  }
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

  constructor(graph, id) {
    this.graph = graph;
    this.id = id;

    this.position.x = this.graph.canvas.canvasCenterX;
    this.position.y = this.graph.canvas.canvasCenterY;
    this.draggable = new DraggableStore();
  }

  @action
  addPort = () => {
    const port = new GraphNodePort(this, shortid.generate(), this.ports.length);
    this.ports.push(port);
    return port;
  };

  @action
  updatePosition = (deltaX, deltaY) => {
    this.position.x += deltaX / this.graph.canvas.scale;
    this.position.y += deltaY / this.graph.canvas.scale;
  };
}

export class CanvasStore {
  canvasWidth = 50000;
  canvasHeight = 50000;

  canvasWindowWidth = 1500;
  canvasWindowHeight = 800;

  canvasCenterX = this.canvasWidth / 2;
  canvasCenterY = this.canvasHeight / 2;

  @observable scale = 1;

  @observable
  translate = {
    x: (this.canvasWindowWidth - this.canvasWidth) / 2 / this.canvasWidth,
    y: (this.canvasWindowHeight - this.canvasHeight) / 2 / this.canvasHeight
  };

  @action
  windowPointToCanvas(windowX, windowY) {
    return {
      x: windowX - this.translate.x * this.canvasWidth
    };
  }

  @action
  panCanvas(deltaX, deltaY) {
    this.translate.x += deltaX / this.canvasWidth;
    this.translate.y += deltaY / this.canvasHeight;
  }

  @action
  scaleCanvas(deltaY) {
    if (deltaY < 0) {
      this.scaleUp();
    } else {
      // scrolled down
      this.scaleDown();
    }
  }

  @action
  scaleDown() {
    const minScale = 0.5;

    if (this.scale > minScale) {
      this.scale -= 0.05;
    }
  }

  @action
  scaleUp() {
    const maxScale = 2;

    if (this.scale < maxScale) {
      this.scale += 0.05;
    }
  }
}

class Connection {
  @observable ports = [];

  constructor(...ports) {
    this.ports = ports;
  }
}

export class GraphStore {
  @observable nodes = [];
  @observable canvas = new CanvasStore();
  @observable newConnection = null;
  @observable connections = [];

  @action
  addNode() {
    const node = new GraphNode(this, shortid.generate());
    this.nodes.push(node);
    return node;
  }

  @action
  beginNewConnection(sourcePort) {
    const newConnection = new NewConnection(sourcePort);
    this.newConnection = newConnection;
    return newConnection;
  }

  @action
  connectPorts(portA, portB) {
    const connection = new Connection(portA, portB);

    this.connections.push(connection);

    portA.connectedPorts.push(portA);
    portB.connectedPorts.push(portB);

    return connection;
  }

  @action
  handlePotentialConnection(destinationPort) {
    if (!this.newConnection) return; // User is just mousing over, not an incoming connection
    this.connectPorts(this.newConnection.sourcePort, destinationPort);
    this.newConnection = null;
  }

  @action
  cancelNewConnection() {
    this.newConnection = null;
  }
}
