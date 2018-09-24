import { GraphStore, GraphStoreParams } from "./GraphStore";
export { GraphStore, GraphStoreParams };
export { Graph } from "./components/Graph";

export * from "./types";

export function createGraphStore(params: GraphStoreParams): GraphStore {
  const graphStore = new GraphStore(params);

  return graphStore;
}
