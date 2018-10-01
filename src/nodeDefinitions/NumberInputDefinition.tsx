import * as React from "react";
import {
  NodeDefinition,
  NodeDefinitionCanvasProps,
  Output,
  Input
} from "../core/NodeDefinition";
import { mapTo } from "rxjs/operators";
import { Observable } from "rxjs";

export interface NumberInputDefinitionConfig {
  value: number;
}

export class NumberInputDefinition extends NodeDefinition<
  NumberInputDefinitionConfig
> {
  name = "numberInput";

  defaultConfig = {
    value: 150
  };

  @Input({ abstract: true })
  input: Observable<never> = new Observable();

  @Output("value")
  output = (config: NumberInputDefinitionConfig) =>
    this.input.pipe(mapTo(config.value));

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
