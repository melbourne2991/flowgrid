import * as React from "react";
import {
  NodeDefinition,
  NodeDefinitionCanvasProps,
  Output,
  Input
} from "../core/NodeDefinition";
import { mapTo, tap } from "rxjs/operators";
import { Observable } from "rxjs";

export interface NumberOutputDefinitionConfig {
  value: number;
}

export class NumberOutputDefinition extends NodeDefinition<
  NumberOutputDefinitionConfig
> {
  name = "numberOutput";

  defaultConfig = {
    value: 100
  };

  @Input("value")
  input: Observable<number> = new Observable();

  @Output({ abstract: true })
  output = () =>
    this.input.pipe(
      tap(value => {
        this.updateConfig(config => {
          config.value = value;
        });
      })
    );

  canvas = (props: NodeDefinitionCanvasProps<NumberOutputDefinitionConfig>) => {
    return <div>{props.config.value}</div>;
  };
}
