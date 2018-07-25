import { CreateGraphStore } from "../../lib/Graph";

const graphConfig = {
  handlers: {
    onNewConnection(sourcePort, destinationPort) {
      if (sourcePort.type === "input" && destinationPort.type === "output") {
        return true;
      }

      if (destinationPort.type === "input" && sourcePort.type === "output") {
        return true;
      }

      return false;
    }
  }
};

export class FlowGraphStore {
  graphStore = CreateGraphStore(graphConfig);

  constructor() {
    const node1 = this.graphStore.addNode("basic");

    const node1Port1 = node1.addPort("input", {
      index: 0
    });

    const node1Port2 = node1.addPort("input", {
      index: 1
    });

    const node1Port3 = node1.addPort("output", {
      index: 0
    });

    const node2 = this.graphStore.addNode("basic");

    const node2Port1 = node2.addPort("input", {
      index: 0
    });

    const node2Port2 = node2.addPort("output", {
      index: 0
    });

    const node2Port3 = node2.addPort("output", {
      index: 1
    });
  }
}
