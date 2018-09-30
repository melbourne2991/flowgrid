import * as React from "react";
import {
  NodeDefinition,
  NodeDefinitionCanvasProps
} from "../core/NodeDefinition";
import { mapTo } from "rxjs/operators";

export interface NumberInputDefinitionConfig {
  value: number;
}

export class NumberInputDefinition extends NodeDefinition<
  never,
  number,
  NumberInputDefinitionConfig
> {
  output = (config: NumberInputDefinitionConfig) => mapTo(config.value);

  defaultConfig = {
    value: 100
  };

  canvas = (props: NodeDefinitionCanvasProps<NumberInputDefinitionConfig>) => {
    return (
      <input
        type="number"
        value={isNaN(props.config.value) ? "" : props.config.value}
        onChange={e => {
          props.updateConfig(config => {
            config.value = parseFloat(e.currentTarget.value);
          });
        }}
      />
    );
  };
}
