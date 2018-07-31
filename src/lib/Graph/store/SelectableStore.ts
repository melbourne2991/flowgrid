import { computed, action } from "mobx";
import { GraphObject } from "./GraphObject";

export class SelectableStore {
  graphObject: GraphObject;

  @computed
  get selected() {
    return this.graphObject.graph.activeSelection === this.graphObject;
  }

  constructor(graphObject: GraphObject) {
    this.graphObject = graphObject;
  }

  @action.bound
  select() {
    this.graphObject.graph.activeSelection = this.graphObject;
  }
}
