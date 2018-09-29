import { types, getEnv } from "mobx-state-tree";
import { getGraph } from "./helpers/getGraph";

export const SelectableModel = types
  .model("Selectable", {})
  .actions(self => ({
    select() {
      getGraph(self).select(self);
    }
  }))
  .views(self => ({
    get selected() {
      return selfIsSelected(self);
    }
  }));

function selfIsSelected(self: any): boolean {
  const graph = getEnv(self).graph;
  return graph.selected.includes(self);
}
