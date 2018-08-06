import * as React from "react";

function createInjectionContext<Injectables>() {
  const Context = React.createContext<Injectables>({} as Injectables);

  const Provider: React.SFC<Injectables> = (props: Injectables) => {
    const { children, ...rest } = props as any;
    return <Context.Provider value={rest} children={children} />;
  };

  function inject<P, K extends keyof Injectables>(...injections: K[]) {
    return (Component: React.ComponentType<P & Pick<Injectables, K>>) => {
      return ((props: P) => {
        return (
          <Context.Consumer>
            {injectables => {
              const mapped: Pick<Injectables, K> = {} as any;

              injections.forEach(injection => {
                mapped[injection] = injectables[injection];
              });

              return <Component {...props} {...mapped} />;
            }}
          </Context.Consumer>
        );
      }) as React.SFC<P>;
    };
  }

  return {
    Provider,
    inject
  };
}
