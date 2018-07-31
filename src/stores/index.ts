import { FlowGraphStore } from "../containers/FlowGraph/store";
import { RootStore } from "./RootStore";
import { NodeTypeDefinition } from "../lib/types";
import { Dict } from "../types";

interface CreateStoresParams {
  nodeTypes: NodeTypeDefinition[];
}

export const createStores = ({ nodeTypes }: CreateStoresParams) => {
  const root = new RootStore({
    nodeTypes
  });

  return {
    rootStore: root,
    ...root.stores
  };
};
