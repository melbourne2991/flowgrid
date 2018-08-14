import { zip } from "rxjs";
import { map } from "rxjs/operators";
import { NodeDefinition } from "../core/types";

export interface AdderNodeInputTypes {
  left: number;
  right: number;
}

export interface AdderNodeOutputTypes {
  sum: number;
}

export const AdderNodeDefinition: NodeDefinition<
  AdderNodeInputTypes,
  AdderNodeOutputTypes
> = {
  name: "AdderNode",

  template: "basic",

  inputs: {
    left: {},
    right: {}
  },

  outputs: {
    sum: {}
  },

  link: inputs => params => {
    return {
      sum: zip(inputs.left, inputs.right).pipe(
        map(([a, b]: [number, number]) => {
          return a + b;
        })
      )
    };
  }
};
