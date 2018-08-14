import * as React from "react";
import { NodeDefinition } from "../core/types";
import { of } from "rxjs";

export interface NumberNodeInputTypes {}
export interface NumberNodeOutputTypes {
  value: number;
}

export interface NumberNodeParams {
  value: number;
}

export const NumberNodeCanvas: React.SFC = () => {
  return <div />;
};

export const NumberNodeDefinition: NodeDefinition<
  NumberNodeInputTypes,
  NumberNodeOutputTypes,
  NumberNodeParams,
  "canvas"
> = {
  name: "NumberNode",

  template: {
    type: "canvas",
    config: {
      render: NumberNodeCanvas
    }
  },

  inputs: {},

  outputs: {
    value: {}
  },

  link: inputs => params => {
    return {
      value: of(params.value)
    };
  }
};
