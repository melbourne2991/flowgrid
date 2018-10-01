import { IGraph } from "./lib/Graph";
import { onPatch } from "mobx-state-tree";

// Determines when to recompile the code
// reacting to graph changes

const watchPaths = [];

export class GraphChangeInterceptor {
  graph: IGraph;
  handler: () => void;
  constructor(graph: IGraph, handler: () => void) {
    this.graph = graph;
    this.handler = handler;

    onPatch(this.graph as any, patch => {
      if (patch.path.includes("/connections")) {
        this.handler();
      }
    });
  }
}
