import { CreateGraphStore } from "../../lib/Graph";
import { defaultNodeTemplate } from "./defaultNodeTemplate";
import { action, observable, observe, computed } from "mobx";
import { RootStore } from "../../stores/RootStore";
import {
  GraphStore,
  SerializedGraphStore,
  GraphNode
} from "../../lib/Graph/store";
import { GraphConfig } from "../../lib/Graph/types";
import { SerializeableObject } from "../../types";
import { NodeTypeDefinition } from "../../lib/types";

const graphConfig: Partial<GraphConfig> = {
  nodeTemplates: {
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

export interface SerializedFlowGraphStore {
  graphStore: SerializedGraphStore;
}

export class FlowGraphStore
  implements SerializeableObject<SerializedFlowGraphStore> {
  @observable sidebar;

  rootStore: RootStore;
  graphStore: GraphStore;

  get nodeTypes() {
    return this.rootStore.nodeTypes;
  }

  @computed
  get selectedNode() {
    if (
      this.graphStore.activeSelection &&
      this.graphStore.activeSelection.isNode
    ) {
      return (this.graphStore.activeSelection as GraphNode).data;
    }

    return null;
  }

  constructor(rootStore: RootStore) {
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
  addNode(nodeType: NodeTypeDefinition, pos) {
    const graphNode = this.graphStore.addNode("basic", {
      nodeType: nodeType.config.name
    });

    if (nodeType.config.outputs) {
      Object.keys(nodeType.config.outputs).forEach((key, index) => {
        graphNode.addPort("output", {
          index,
          label: nodeType.config.outputs[key].label,
          outputName: key
        });
      });
    }

    if (nodeType.config.inputs) {
      Object.keys(nodeType.config.inputs).forEach((key, index) => {
        graphNode.addPort("input", {
          index,
          label: nodeType.config.inputs[key].label,
          inputName: key
        });
      });
    }

    graphNode.updatePositionWithClientOffset(pos.x, pos.y);
  }

  serialize() {
    return {
      graphStore: this.graphStore.serialize()
    };
  }

  deserialize(serialized: SerializedFlowGraphStore) {
    this.graphStore.deserialize(serialized.graphStore);
  }
}
