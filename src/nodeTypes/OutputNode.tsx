import * as React from "react";
import { defineNodeType } from "../core/defineNodeType";
import { SetConfigFn } from "../core/types";

export interface OutputNodeUIProps {
  setConfig: SetConfigFn;
}

export class OutputNodeUI extends React.Component<OutputNodeUIProps> {
  render() {
    return (
      <React.Fragment>
        <div>Hello</div>
      </React.Fragment>
    );
  }
}

export const OutputNode = defineNodeType({
  name: "OutputNode",
  render: setConfig => <OutputNodeUI setConfig={setConfig} />,

  inputs: {
    main: {
      label: "text"
    }
  }
})((input, config) => {
  return input;
});
