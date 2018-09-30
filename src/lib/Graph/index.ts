import { GraphStore, GraphStoreParams } from "./GraphStore";
import { GraphEngine } from "./GraphEngine";
export { GraphStore, GraphStoreParams };
export { Graph } from "./components/Graph";
export { GraphEngine } from "./GraphEngine";

export * from "./types";
export * from "./models";

export function createGraphStore(
  params?: Partial<GraphStoreParams>
): GraphStore {
  params = params || {
    engine: new GraphEngine(),
    env: {
      graphStore: () => graphStore
    }
  };

  params.engine = params.engine || new GraphEngine();
  params.env = params.env || {
    graphStore: () => graphStore
  };

  const graphStore: GraphStore = new GraphStore(params as GraphStoreParams);

  return graphStore;
}
