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

export abstract class NodeDefinition<I, O, C extends any> {
  id: string;

  abstract defaultConfig: C;
  abstract output: (config: C) => OperatorFunction<I, O>;

  canvas?: (props: NodeDefinitionCanvasProps<C>) => React.ReactNode;
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
