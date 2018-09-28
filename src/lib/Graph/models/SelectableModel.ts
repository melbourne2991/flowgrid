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
  const selectedItem = getEnv(self).graph.selected;

  if (selectedItem && selectedItem.id === self.id) {
    return true;
  }

  return false;
}
