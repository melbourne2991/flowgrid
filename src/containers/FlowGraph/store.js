import { CreateGraphStore } from "../../lib/Graph";
import { defaultNodeTemplate } from "./defaultNodeTemplate";
import { computed, action, observable } from "mobx";

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

  graphStore = CreateGraphStore(graphConfig);

  get nodeTypes() {
    return this.rootStore.nodeTypes;
  }

  constructor(rootStore) {
    this.sidebar = new SidebarStore();
    this.rootStore = rootStore;
  }

  @action.bound
  addNode(nodeType, pos) {
    const node = this.graphStore.addNode("basic", {
      nodeType
    });

    Object.keys(nodeType.config.outputs).forEach((key, index) => {
      node.addPort("output", {
        index,
        label: nodeType.config.outputs[key].label,
        outputName: key
      });

      node.updatePositionWithClientOffset(pos.x, pos.y);
    });
  }
}
