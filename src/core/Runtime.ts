import { Node } from "./Node";
import { NodeDefinition } from "./types";

export interface RuntimeParams {}

export class Runtime {
  nodes: Node<any, any, any>[];

  constructor(params?: RuntimeParams) {
    this.nodes = [];
  }

  addNode(
    id: string,
    nodeDefinition: NodeDefinition<any, any, any>,
    initialValue?: any
  ) {
    const node = new Node(id, nodeDefinition);
    this.nodes.push(node);
  }

  removeNodeByIndex(index: number) {
    this.nodes.splice(index, 1);
  }
}
