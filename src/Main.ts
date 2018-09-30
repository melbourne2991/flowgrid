import { createGraphStore, GraphStore, IGraphNode } from "./lib/Graph";
import { NodeDefinition } from "./core/NodeDefinition";
import { BasicIONodeTemplate } from "./nodeTemplates/basic";
import * as uniqid from "uniqid";
import { produce } from "immer";
import { getSnapshot } from "mobx-state-tree";

const basic = new BasicIONodeTemplate();

export class Main {
  graphStore: GraphStore;
  rootModel: any;
  env: any;

  constructor() {
    this.env = {
      graphStore: () => this.graphStore
    };

    this.graphStore = createGraphStore({
      env: this.env
    });

    (window as any).showSnapshot = () =>
      getSnapshot(this.graphStore.graph as any);
  }

  createNodeFromDefinition(NodeDef: new () => NodeDefinition<any, any, any>) {
    const nodeInstance = new NodeDef();
    const id = uniqid();

    const nodeData: any = {
      config: nodeInstance.defaultConfig
    };

    if (nodeInstance.canvas) {
      nodeData.canvas = (graphNode: IGraphNode) =>
        nodeInstance.canvas!({
          config: graphNode.data.config,
          updateConfig: callback => {
            const newConfig = produce(graphNode.data.config, callback);

            graphNode.updateData({
              ...graphNode.data,
              config: newConfig
            });
          }
        });
    }

    const visualNode = this.graphStore.addNode(basic, nodeData, id);

    this.graphStore.addPortToNode(visualNode, {
      type: "output",
      label: "Some output",
      index: 0
    });
  }

  getConfig(id: string) {
    return this.rootModel.configMap.get(id);
  }
}
