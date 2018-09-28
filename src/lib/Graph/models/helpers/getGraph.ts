import { getEnv } from "mobx-state-tree";
import { IGraph } from "../../types";

export function getGraph(self: any): IGraph {
  return getEnv(self).graph;
}
