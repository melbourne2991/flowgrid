import { createGraphStore, GraphStore, IGraphNode } from "./lib/Graph";
import { NodeDefinition, UpdateConfigFn } from "./core/NodeDefinition";

import * as uniqid from "uniqid";
import { produce } from "immer";
import { GraphChangeInterceptor } from "./GraphChangeInterceptor";
import { BasicIONodeTemplate } from "./nodeTemplates/basic";

export class Main {
  graphStore: GraphStore;
  rootModel: any;
  env: any;

  nodeDefinitions: {
    [name: string]: NodeDefinition<any>
  }

  constructor(params: { nodeDefinitions: NodeDefinition<any>[] }) {
    this.nodeDefinitions = {};

    params.nodeDefinitions.forEach((def) => {
      this.nodeDefinitions[def.name] = def;
    });

    this.env = {
      graphStore: () => this.graphStore
    };

    this.graphStore = createGraphStore({
      env: this.env,
      nodeTemplates: {
        basic: new BasicIONodeTemplate({
          renderCanvas: this.renderCanvasForNode
        })
      }
    });

    new GraphChangeInterceptor(this.graphStore.graph, () => {
      console.log("change");
      console.log(this.graphStore.graph.nodes[0]);
    });
  }

  // should memoize this call or prebind it and cache the result 
  // as it's being called in render method
  bindUpdateNodeConfig = (node: IGraphNode) => {
    return (callback: UpdateConfigFn<any>) => {
      const updatedConfig = produce(node.data.config, callback);

      node.updateData({
        ...node.data,
        config: updatedConfig
      });
    }
  }

  renderCanvasForNode = (node: IGraphNode) => {
    const { canvas } = this.nodeDefinitions[node.data.nodeDefinitionName];

    if (canvas) {
      return canvas({ 
        config: node.data.config, 
        updateConfig: this.bindUpdateNodeConfig(node)
      });
    }

    return null;
  }

  createNodeFromDefinition(nodeDefinitionName: string) {
    const nodeDefinition = this.nodeDefinitions[nodeDefinitionName];
    const id = uniqid();

    const graphNode = this.graphStore.addNode('basic', {
      nodeDefinitionName: nodeDefinitionName,
      config: nodeDefinition.defaultConfig
    }, id);

    let inputCount = 0;
    let outputCount = 0;

    Object.keys(nodeDefinition).map(key => {
      const inputMetadata = Reflect.getMetadata("__input", nodeDefinition, key);
      const outputMetadata = Reflect.getMetadata("__output", nodeDefinition, key);

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

  // createNodeFromDefinition(NodeDef: new () => NodeDefinition<any>) {
  //   let graphNode: IGraphNode;

  //   const nodeInstance = new NodeDef();

  //   const id = uniqid();
  //   const nodeData: any = {
  //     config: nodeInstance.defaultConfig
  //   };

  //   const updateConfig = (callback: UpdateConfigFn<any>) => {
  //     const newConfig = produce(graphNode.data.config, callback);

  //     graphNode.updateData({
  //       ...graphNode.data,
  //       config: newConfig
  //     });
  //   };

  //   if (nodeInstance.canvas) {
  //     nodeData.canvas = (graphNode: IGraphNode) =>
  //       nodeInstance.canvas!({
  //         config: graphNode.data.config,
  //         updateConfig
  //       });
  //   }

  //   graphNode = this.graphStore.addNode("basic", nodeData, id);

  //   nodeInstance.updateConfig = updateConfig;

  //   let inputCount = 0;
  //   let outputCount = 0;

  //   Object.keys(nodeInstance).map(key => {
  //     const inputMetadata = Reflect.getMetadata("__input", nodeInstance, key);
  //     const outputMetadata = Reflect.getMetadata("__output", nodeInstance, key);

  //     if (inputMetadata && !inputMetadata.abstract) {
  //       this.graphStore.addPortToNode(graphNode, {
  //         type: "input",
  //         label: inputMetadata.name,
  //         index: inputCount++
  //       });
  //     }

  //     if (outputMetadata && !outputMetadata.abstract) {
  //       this.graphStore.addPortToNode(graphNode, {
  //         type: "output",
  //         label: outputMetadata.name,
  //         index: outputCount++
  //       });
  //     }
  //   });
  // }
}
