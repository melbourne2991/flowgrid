import { GraphStore } from "./GraphStore";
import { GraphObjectTypes } from "../types";

export class GraphObject {
  graphObjectType: keyof GraphObjectTypes;
  graph: GraphStore;

  constructor(graph: GraphStore) {
    this.graph = graph;
  }

  get isNode() {
    return this.graphObjectType === "GraphNode";
  }

  get isPort() {
    return this.graphObjectType === "GraphNodePort";
  }

  get isConnection() {
    return this.graphObjectType === "Connection";
  }

  get isNewConnection() {
    return this.graphObjectType === "NewConnection";
  }
}
