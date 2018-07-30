import { DefineNodeType } from "./types";

export const defineNodeType: DefineNodeType = config => {
  return fn => {
    return {
      fn,
      config
    };
  };
};
