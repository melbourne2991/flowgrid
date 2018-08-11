import { Observable } from "rxjs";
import {
  ObservableContainer,
  createObservableContainer
} from "./boxedObserable";
import { Dict } from "../types";

interface ConnectInputFn {
  (this: NodeDefinition, inputName: string, source: Observable<any>): void;
}

interface DisconnectInputFn {
  (this: NodeDefinition, inputName: string): void;
}

interface NodeDefinition {
  inputs: Dict<ObservableContainer<any>>;
  outputs: any[];
  connectInput: ConnectInputFn;
}

interface OutputFn {
  (inputs: Dict<Observable<any>>): Dict<Observable<any>>;
}

export function nodeDefinition(...inputNames: string[]) {
  const connectInput: ConnectInputFn = function(inputName, source) {
    this.inputs[inputName].set(source);
  };

  const disconnectInput: DisconnectInputFn = function(inputName: string) {
    this.inputs[inputName].clear();
  };

  return (create: OutputFn) => {
    const inputs: Dict<ObservableContainer<any>> = {};
    const inputGetters: Dict<Observable<any>> = {};

    inputNames.forEach(key => {
      inputs[key] = createObservableContainer();
      inputGetters[key] = inputs[key].$;
    });

    return {
      inputs: inputs,
      outputs: create(inputGetters),
      connectInput,
      disconnectInput
    };
  };
}
