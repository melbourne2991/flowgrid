import { computed, action } from "mobx";
import { GraphNode } from "./";

export class SelectableStore {
  node: GraphNode;

  @computed
  get selected() {
    return this.node.graph.activeSelection === this.node;
  }

  constructor(node) {
    this.node = node;
  }

  @action.bound
  select() {
    this.node.graph.activeSelection = this.node;
  }
}
