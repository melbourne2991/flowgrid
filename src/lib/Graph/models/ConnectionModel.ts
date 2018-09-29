import { types } from "mobx-state-tree";
import { SelectableModel } from "./SelectableModel";
import { PortModel } from "./PortModel";

export const ConnectionModel = types
  .compose(
    SelectableModel,
    types.model("Connection", {
      type: "connection",
      id: types.identifier,
      source: types.reference(PortModel),
      target: types.reference(PortModel)
    })
  )
  .named("Connection");
