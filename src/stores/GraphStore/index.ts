import {
  createGraphStore,
  GraphStore as VisualGraphStore,
  Point
} from "../../lib/Graph";
import { basic } from "../../nodeTemplates/basic";
import { NodeDefinition } from "../../core/types";
import * as uniqid from "uniqid";
import { Runtime } from "../../core/Runtime";
import { reaction } from "mobx";
import { onPatch, IAnyStateTreeNode } from "mobx-state-tree";

export interface GraphStoreParams {
  nodeDefinitions: NodeDefinition<any, any, any>[];
}

export class GraphStore {
  visualGraphStore: VisualGraphStore;

  runtime: Runtime;
  nodeFactories: {};

  constructor({ nodeDefinitions }: GraphStoreParams) {
    this.runtime = new Runtime();

    this.visualGraphStore = createGraphStore({
      nodeTemplates: { basic }
    });

    onPatch(this.visualGraphStore.graph.nodes as IAnyStateTreeNode, patch => {
      if (patch.op === "add" && patch.path.split("/").length === 2) {
        console.log(patch);
      }
    });
  }

  addNode(
    nodeDefinition: NodeDefinition<any, any, any>,
    position: Point,
    initialValue: any = {}
  ) {
    const id = uniqid();

    const visualNode = this.visualGraphStore.addNode(id, "basic", {
      nodeDefinitionName: nodeDefinition.name
    });

    Object.keys(nodeDefinition.inputs).forEach((key, index) => {
      this.visualGraphStore.addPortToNode(visualNode, {
        type: "input",
        label: nodeDefinition.inputs[key].label || key,
        index
      });
    });

    Object.keys(nodeDefinition.outputs).forEach((key, index) => {
      this.visualGraphStore.addPortToNode(visualNode, {
        type: "output",
        label: nodeDefinition.outputs[key].label || key,
        index
      });
    });

    visualNode.updatePosition(position.x, position.y);

    this.runtime.addNode(id, nodeDefinition, initialValue);
  }
}
