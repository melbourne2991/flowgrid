import { GraphStore as VisualGraphStore, IGraphNode } from "../../lib/Graph";
import { Runtime } from "../../core/Runtime";
import { onPatch, IAnyStateTreeNode } from "mobx-state-tree";

/**
 * Synchronises updates to UI graph visualisation
 * with actual graph.
 */
class GraphRuntimeReconciler {
  runtime: Runtime;
  visualGraphStore: VisualGraphStore;

  constructor(runtime: Runtime, visualGraphStore: VisualGraphStore) {
    this.runtime = runtime;
    this.visualGraphStore = visualGraphStore;

    onPatch(this.visualGraphStore.graph.nodes as IAnyStateTreeNode, patch => {
      const parts = pathParts(patch.path);

      if (patch.op === "add" && parts.length === 1) {
        this.onAddNode(patch.value);
      }
    });

    onPatch(this.visualGraphStore.graph.nodes as IAnyStateTreeNode, patch => {
      const parts = pathParts(patch.path);

      if (patch.op === "remove" && parts.length === 1) {
        this.onRemoveNode(patch.value);
      }
    });
  }

  onAddNode(node: IGraphNode) {}
  onRemoveNode(index: number) {}
}

function pathParts(path: string): string[] {
  const pathWithRoot = path.split("/");
  pathWithRoot.shift();
  return pathWithRoot;
}
