import { types, destroy, getEnv, detach } from "mobx-state-tree";
import { NodeModel } from "../../lib/Graph/GraphStore";

export const GraphFacadeNodeModel = types.model("GraphFacadeNode", {
  id: types.identifier,
  nodes: types.reference(NodeModel),
  runtimeNodeRef: types.string
});

export const GraphFacadeModel = types.model("GraphFacade", {
  nodes: types.array(GraphFacadeNodeModel)
});
