import {
  GraphNode,
  GraphNodePort,
  NewConnection,
  Connection,
  CanvasStore
} from "./";
import { action, observable } from "mobx";
import * as shortid from "shortid";
import { Serializeable } from "../../../types";
import { SerializedGraphNode } from "./GraphNode";
import { SerializedConnection } from "./Connection";

export class GraphStore implements Serializeable<SerializedGraphStore> {
  @observable activeSelection = null;
  @observable nodes = [];
  @observable newConnection = null;
  @observable connections = [];
  @observable selectedNode = null;

  canvas: CanvasStore;
  config: {
    handlers: {
      onNewConnection(
        sourcePort: GraphNodePort,
        destinationPort: GraphNodePort
      );
    };
  };

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

  serialize() {
    return {
      nodes: this.nodes.map(node => node.serialize()),
      connections: this.connections.map(connection => connection.serialize())
    };
  }

  deserialize(serialized: SerializedGraphStore) {}
}

export interface SerializedGraphStore {
  nodes: SerializedGraphNode[];
  connections: SerializedConnection[];
}
