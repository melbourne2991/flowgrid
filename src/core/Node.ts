import {
  NodeDefinition,
  ToObservableContainerDict,
  ToObservableDict,
  Dict,
  OutputUpdateFn
} from "./types";

import { Observable } from "rxjs";

import { createObservableContainer } from "./ObservableContainer";

export class Node<InputTypes, OutputTypes, Params = undefined> {
  private _inputContainers: ToObservableContainerDict<InputTypes>;
  private _outputContainers: ToObservableContainerDict<OutputTypes>;
  private _updateOutputObserables: OutputUpdateFn<OutputTypes, Params>;

  id: string;
  inputs: ToObservableDict<InputTypes>;
  outputs: ToObservableDict<OutputTypes>;

  constructor(
    id: string,
    nodeDefinition: NodeDefinition<InputTypes, OutputTypes, Params>
  ) {
    this.id = id;

    const { inputs, outputs, link } = nodeDefinition;

    this.inputs = {} as ToObservableDict<InputTypes>;
    this.outputs = {} as ToObservableDict<OutputTypes>;

    this._inputContainers = {} as ToObservableContainerDict<InputTypes>;
    this._outputContainers = {} as ToObservableContainerDict<OutputTypes>;

    this._createContainers(this._inputContainers, this.inputs, inputs);
    this._createContainers(this._outputContainers, this.outputs, outputs);

    this._updateOutputObserables = link(this.inputs);
  }

  private _createContainers(
    containerStore: ToObservableContainerDict<any>,
    store: ToObservableDict<any>,
    obj: Dict<{}>
  ) {
    Object.keys(obj).forEach(key => {
      const container = createObservableContainer();
      containerStore[key] = container;
      store[key] = container.$;
    });
  }

  update = <K extends keyof OutputTypes>(params: Params) => {
    const newOutputObservables = this._updateOutputObserables(params);

    Object.keys(newOutputObservables).forEach(key => {
      this._outputContainers[key as K].set(newOutputObservables[key as K]);
    });
  };

  connectInput = <K extends keyof InputTypes>(
    inputName: K,
    source: Observable<InputTypes[K]>
  ) => {
    this._inputContainers[inputName].set(source);
  };
}
