import { GraphStore } from "./GraphStore";

export function bindKeyEvents(graphStore: GraphStore) {
  graphStore.keyTracker.onKeyDown("delete", () => {
    if (graphStore.graph.selected !== null) {
    }
  });
}
