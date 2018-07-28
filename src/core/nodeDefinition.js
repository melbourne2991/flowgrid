export const nodeDefinition = config => {
  return fn => {
    return {
      fn,
      config
    };
  };
};
