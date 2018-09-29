import { GraphStore } from "./GraphStore";

export function bindKeyEvents(graphStore: GraphStore) {
  graphStore.keyTracker.onKeyDown("delete", () => {
    if (graphStore.graph.selected !== null) {
      graphStore.engine.handleDelete(graphStore.graph.selected);
    }
  });

  graphStore.keyTracker.onKeyDown("ctrl", () => {
    graphStore.engine.handleUpdateSelectionMode("multi");
  });

  graphStore.keyTracker.onKeyUp("ctrl", () => {
    graphStore.engine.handleUpdateSelectionMode("single");
  });
}
