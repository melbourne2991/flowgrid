import { GraphStore } from "./GraphStore";

export class GraphObject {
  graph: GraphStore;

  constructor(graph: GraphStore) {
    this.graph = graph;
  }
}
