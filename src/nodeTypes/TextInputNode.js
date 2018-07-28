import React from "react";
import { nodeDefinition } from "../core/nodeDefinition";

class TextInputNodeUI extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div>Hello</div>
      </React.Fragment>
    );
  }
}

export const TextInputNode = nodeDefinition({
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
