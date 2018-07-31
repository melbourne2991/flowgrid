import {
  GraphNode,
  GraphNodePort,
  NewConnection,
  Connection,
  CanvasStore
} from "./";

import { action, observable } from "mobx";
import { SerializeableObject, SerializeableDict } from "../../../types";
import { SerializedGraphNode } from "./GraphNode";
import { SerializedConnection } from "./Connection";
import { GraphConfig } from "../types";
import { GraphObject } from "./GraphObject";

import { createFactories, GraphObjectFactories } from "./GraphObjectFactories";

export class GraphStore implements SerializeableObject<SerializedGraphStore> {
  @observable activeSelection: GraphObject = null;
  @observable nodes: GraphNode[] = [];
  @observable newConnection: NewConnection = null;
  @observable connections: Connection[] = [];

  canvas: CanvasStore;
  config: GraphConfig;

  create: GraphObjectFactories["create"];
  createWithId: GraphObjectFactories["createWithId"];

  constructor({ canvas, config }) {
    this.canvas = canvas;
    this.config = config;

    const graphObjectFactories = createFactories(this);

    this.create = graphObjectFactories.create;
    this.createWithId = graphObjectFactories.createWithId;
  }

  @action
  addNode(template: string, data: SerializeableDict) {
    const node = this.createWithId("GraphNode", {
      template,
      data
    });

    this.nodes.push(node);
    return node;
  }

  @action
  beginNewConnection(sourcePort: GraphNodePort) {
    const newConnection = this.createWithId("NewConnection", {
      sourcePort
    });

    this.newConnection = newConnection;
    return newConnection;
  }

  @action
  connectPorts(portA: GraphNodePort, portB: GraphNodePort) {
    const connection = this.createWithId("Connection", {
      ports: [portA, portB]
    });

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

  deserialize(serialized: SerializedGraphStore) {
    this.nodes = serialized.nodes.map(serializedNode => {
      const graphNode = this.create("GraphNode", serializedNode.id, {
        data: serializedNode.data,
        template: serializedNode.template
      });

      return graphNode;
    });
  }
}

export interface SerializedGraphStore {
  nodes: SerializedGraphNode[];
  connections: SerializedConnection[];
}
