import { IGraph } from "./types";
import { types } from "mobx-state-tree";

import {
  createGraphModel,
  createNodeModel,
  createPortModel,
  createConnectionModel,
  createNewConnectionModel
} from "./models";
import { GraphStore } from "./GraphStore";

export { Graph } from "./components/Graph";

export * from "./types";

export function createGraphStore(): GraphStore {
  const graphStore = new GraphStore();

  return graphStore;
}
