import * as React from "react";
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

type RenderCanvasProps<P, Params> = P & {
  updateParams: (params: Params) => void;
};

export class AdderNodeRender extends React.Component<
  RenderCanvasProps<{}, {}>
> {
  constructor(props: RenderCanvasProps<{}, {}>) {
    super(props);
  }

  render() {
    return (
      <div>
        <input type="text" />
      </div>
    );
  }
}

export const AdderNodeDefinition: NodeDefinition<
  AdderNodeInputTypes,
  AdderNodeOutputTypes
> = {
  name: "AdderNode",

  template: {
    type: "basic",
    config: {
      canvas: {
        size: {
          x: 500,
          y: 300
        },
        render: AdderNodeRender
      }
    }
  },

  initialParams: {},

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
