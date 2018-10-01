import { GraphStore, GraphStoreParams } from "./GraphStore";
import { GraphEngine } from "./GraphEngine";
import { BasicIONodeTemplate } from "../../nodeTemplates/basic";
export { GraphStore, GraphStoreParams };
export { Graph } from "./components/Graph";
export { GraphEngine } from "./GraphEngine";

export * from "./types";
export * from "./models";

export function createGraphStore(
  params?: Partial<GraphStoreParams>
): GraphStore {
  params = params || {};

  params.engine = params.engine || new GraphEngine();
  params.env = params.env || {
    graphStore: () => graphStore
  };

  params.nodeTemplates = params.nodeTemplates || {
    basic: new BasicIONodeTemplate()
  };

  const graphStore: GraphStore = new GraphStore(params as GraphStoreParams);

  return graphStore;
}
