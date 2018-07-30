import { FlowGraphStore } from "../containers/FlowGraph/store";
import { RootStore } from "./RootStore";
import { NodeTypeDefinition } from "../core/types";
import { Dict } from "../types";

interface CreateStoresParams {
  nodeTypes: NodeTypeDefinition[];
}

export const createStores = ({ nodeTypes }: CreateStoresParams) => {
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
