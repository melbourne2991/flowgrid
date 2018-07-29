import { CreateGraphStore, graphEvents } from "../../lib/Graph";
import { defaultNodeTemplate } from "./defaultNodeTemplate";
import { action, observable, observe, computed } from "mobx";

const graphConfig = {
  nodeTypes: {
    basic: defaultNodeTemplate
  },

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

class SidebarStore {
  @observable activeTab = 1;
}

export class FlowGraphStore {
  @observable sidebar;

  get nodeTypes() {
    return this.rootStore.nodeTypes;
  }

  @computed
  get selectedNode() {
    if (!this.graphStore.activeSelection) return null;

    return this.graphStore.activeSelection.data;
  }

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.sidebar = new SidebarStore();
    this.graphStore = CreateGraphStore(graphConfig);

    observe(this.graphStore, "activeSelection", change => {
      if (change.newValue) {
        this.sidebar.activeTab = 0;
      }
    });
  }

  @action.bound
  addNode(nodeType, pos) {
    const graphNode = this.graphStore.addNode("basic", {
      nodeType
    });

    Object.keys(nodeType.config.outputs).forEach((key, index) => {
      graphNode.addPort("output", {
        index,
        label: nodeType.config.outputs[key].label,
        outputName: key
      });

      graphNode.updatePositionWithClientOffset(pos.x, pos.y);
    });
  }
}
