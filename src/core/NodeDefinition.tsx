import { ObservableMap } from "mobx";
import { map } from "mobx-state-tree/dist/internal";
import { OperatorFunction } from "rxjs";
import { Observable } from "indefinite-observable";
import { produce, Draft } from "immer";

export type UpdateConfigFn<C> = (
  this: Draft<C>,
  draftState: Draft<C>
) => void | C;

export interface NodeDefinitionCanvasProps<C> {
  config: C;
  updateConfig(callback: UpdateConfigFn<C>): void;
}

export function Input<T extends NodeDefinition<any>>(
  name: string | { abstract: boolean }
) {
  return (target: T, method: string) => {
    const data = typeof name === "string" ? { name } : name;
    Reflect.defineMetadata("__input", data, target, method);
  };
}

export function Output<T extends NodeDefinition<any>>(
  name: string | { abstract: boolean }
) {
  return (target: T, method: string) => {
    const data = typeof name === "string" ? { name } : name;
    Reflect.defineMetadata("__output", data, target, method);
  };
}

export abstract class NodeDefinition<C extends any> {
  id: string;
  abstract defaultConfig: C;
  canvas?: (props: NodeDefinitionCanvasProps<C>) => React.ReactNode;
  updateConfig: (callback: UpdateConfigFn<C>) => void;
}

// class NodeDefinition {
//   output = map(() => {
//     return this.config.value
//   })

//   defaultState = {
//     value: 0
//   };

//   render() {
//     return (
//       <div style={style}>
//         <input type="text" onChange={(e) => {
//           this.action((state) => {
//             state.value = e.value
//           })
//         }} />
//       </div>
//     )
//   }
// }
