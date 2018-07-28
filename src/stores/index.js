import { FlowGraphStore } from "../containers/FlowGraph/store";
import { RootStore } from "./RootStore";

export const createStores = ({ nodeTypes } = {}) => {
  const root = new RootStore({
    nodeTypes
  });

  const flowGraphStore = new FlowGraphStore(root);

  root.stores = {
    flowGraphStore
  };

  return {
    rootStore: root,
    ...root.stores
  };
};
