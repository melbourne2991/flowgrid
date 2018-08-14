import { Observable } from "rxjs";

export interface ObservableContainer<T> {
  set(newObservable: Observable<T>): void;
  $: Observable<T>;
  clear(): void;
}

export interface InputConfig {
  label?: string;
}

export interface OutputConfig {
  label?: string;
}

export type OutputUpdateFn<OutputTypes, Params> = (
  params: Params
) => ToObservableDict<OutputTypes>;

export interface TemplateConfigTypes<State> {
  canvas: {
    render: React.ComponentType<{
      state: State;
      setState: (state: State) => void;
    }>;
  };

  basic: {};
}

export type TemplateTypes = "basic" | "canvas";

export interface NodeTemplateConfig<T extends TemplateTypes, State> {
  type: T;
  config: TemplateConfigTypes<State>[T];
}

export interface NodeDefinition<
  InputTypes,
  OutputTypes,
  State = {},
  TemplateType extends TemplateTypes = any
> {
  name: string;

  template: "basic" | NodeTemplateConfig<TemplateType, State>;

  inputs: Dict<InputConfig>;
  outputs: Dict<OutputConfig>;

  link: (
    inputs: ToObservableDict<InputTypes>
  ) => OutputUpdateFn<OutputTypes, State>;
}

export type ToObservableDict<T> = { [K in keyof T]: Observable<T[K]> };
export type ToObservableContainerDict<T> = {
  [K in keyof T]: ObservableContainer<T[K]>
};

export type Dict<T> = {
  [key: string]: T;
};
