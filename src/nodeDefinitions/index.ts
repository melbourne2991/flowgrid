import { AdderNodeDefinition } from "./AdderNodeDefinition";
import { NumberNodeDefinition } from "./NumberNodeDefinition";
import { NodeDefinition } from "../core/types";

export const nodeDefinitions: NodeDefinition<any, any, any>[] = [
  AdderNodeDefinition,
  NumberNodeDefinition
];
