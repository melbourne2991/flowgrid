import * as React from "react";
import { defineNodeType } from "../lib/defineNodeType";
import { SetConfigFn } from "../lib/types";

export interface TextInputNodeUIProps {
  setConfig: SetConfigFn;
}

export class TextInputNodeUI extends React.Component<TextInputNodeUIProps> {
  render() {
    return (
      <React.Fragment>
        <div>Hello</div>
      </React.Fragment>
    );
  }
}

export const TextInputNode = defineNodeType({
  name: "TextInputNode",
  render: setConfig => <TextInputNodeUI setConfig={setConfig} />,

  outputs: {
    main: {
      label: "text"
    }
  }
})((input, config) => {
  return input;
});
