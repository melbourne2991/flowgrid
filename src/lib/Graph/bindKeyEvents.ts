import { GraphStore } from "./GraphStore";

export function bindKeyEvents(graphStore: GraphStore) {
  graphStore.keyTracker.onKeyDown(graphStore.keyBindings.DELETE, () => {
    if (graphStore.graph.selected !== null) {
      graphStore.engine.handleDelete(graphStore.graph.selected);
    }
  });

  graphStore.keyTracker.onKeyDown(graphStore.keyBindings.UPDATE_SELECTION_MODE, () => {
    graphStore.engine.handleUpdateSelectionMode("multi");
  });

  graphStore.keyTracker.onKeyUp(graphStore.keyBindings.UPDATE_SELECTION_MODE, () => {
    graphStore.engine.handleUpdateSelectionMode("single");
  });
}
