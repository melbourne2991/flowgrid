import { createGraphStore, GraphStore, IGraphNode } from "./lib/Graph";
import { NodeDefinition, UpdateConfigFn } from "./core/NodeDefinition";
import { BasicIONodeTemplate } from "./nodeTemplates/basic";
import * as uniqid from "uniqid";
import { produce } from "immer";
import { GraphChangeInterceptor } from "./GraphChangeInterceptor";

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

    new GraphChangeInterceptor(this.graphStore.graph, () => {
      console.log("change");
      console.log(this.graphStore.graph.nodes[0]);
    });
  }

  createNodeFromDefinition(NodeDef: new () => NodeDefinition<any>) {
    let graphNode: IGraphNode;

    const nodeInstance = new NodeDef();

    const id = uniqid();
    const nodeData: any = {
      config: nodeInstance.defaultConfig
    };

    const updateConfig = (callback: UpdateConfigFn<any>) => {
      const newConfig = produce(graphNode.data.config, callback);

      graphNode.updateData({
        ...graphNode.data,
        config: newConfig
      });
    };

    if (nodeInstance.canvas) {
      nodeData.canvas = (graphNode: IGraphNode) =>
        nodeInstance.canvas!({
          config: graphNode.data.config,
          updateConfig
        });
    }

    graphNode = this.graphStore.addNode("basic", nodeData, id);

    nodeInstance.updateConfig = updateConfig;

    let inputCount = 0;
    let outputCount = 0;

    Object.keys(nodeInstance).map(key => {
      const inputMetadata = Reflect.getMetadata("__input", nodeInstance, key);
      const outputMetadata = Reflect.getMetadata("__output", nodeInstance, key);

      if (inputMetadata && !inputMetadata.abstract) {
        this.graphStore.addPortToNode(graphNode, {
          type: "input",
          label: inputMetadata.name,
          index: inputCount++
        });
      }

      if (outputMetadata && !outputMetadata.abstract) {
        this.graphStore.addPortToNode(graphNode, {
          type: "output",
          label: outputMetadata.name,
          index: outputCount++
        });
      }
    });
  }
}
