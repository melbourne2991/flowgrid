import { types, getEnv } from "mobx-state-tree";
import { getGraph } from "./helpers/getGraph";
import { IGraphSelectableObject } from "../types";

export const SelectableModel = types
  .model("Selectable", {})
  .actions(self => ({
    select() {
      getGraph(self).select(self as IGraphSelectableObject);
    },

    deselect() {
      getGraph(self).deselect(self as IGraphSelectableObject);
    }
  }))
  .views(self => ({
    get selected() {
      return selfIsSelected(self);
    }
  }));

function selfIsSelected(self: any): boolean {
  const graph = getEnv(self).graphStore().graph;
  return graph.selected.includes(self);
}
