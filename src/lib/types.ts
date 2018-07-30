export interface NodeTypeOutputConfig {
  label: string;
}

export interface NodeTypeInputConfig {
  label: string;
}

export type SetConfigFn = (config: {}) => void;

export interface NodeTypeConfig {
  name: string;
  render(setConfig: SetConfigFn): React.ReactNode;

  outputs?: {
    [outputName: string]: NodeTypeOutputConfig;
  };

  inputs?: {
    [inputName: string]: NodeTypeInputConfig;
  };
}

export type NodeTypeProcessorFn = (input: any, config: any) => void;

export interface NodeTypeDefinition {
  fn: NodeTypeProcessorFn;
  config: NodeTypeConfig;
}

export type DefineNodeType = (
  nodeTypeConfig: NodeTypeConfig
) => (fn: NodeTypeProcessorFn) => NodeTypeDefinition;
