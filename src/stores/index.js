import { FlowGraphStore } from "../containers/FlowGraph/store";
import { RootStore } from "./RootStore";

export const createStores = () => {
  const root = new RootStore({
    flowGraphStore: new FlowGraphStore()
  });

  return {
    rootStore: root,
    ...root.stores
  };
};
