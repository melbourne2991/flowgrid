import { createGraphStore, GraphStore as VisualGraphStore } from "../lib/Graph";
import { basic } from "../nodeTemplates/basic";

export class GraphStore {
  visualGraphStore: VisualGraphStore;

  constructor() {
    this.visualGraphStore = createGraphStore({
      nodeTemplates: { basic }
    });

    const a = this.visualGraphStore.addNode("basic", {});
    const b = this.visualGraphStore.addNode("basic", {});

    this.visualGraphStore.addPortToNode(a, {
      type: "input",
      label: "Helloaa",
      index: 0
    });

    this.visualGraphStore.addPortToNode(b, {
      type: "output",
      label: "Helloba",
      index: 0
    });

    this.visualGraphStore.addPortToNode(b, {
      type: "output",
      label: "Hellobb",
      index: 1
    });

    a.updatePosition(100, 100);
    b.updatePosition(200, 200);
  }

  addNode() {}
}
