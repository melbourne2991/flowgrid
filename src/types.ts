export type Dict<T> = {
  [key: string]: T;
};

export interface Serializeable<T> {
  serialize(): T;
  deserialize(serializedObject: T): void;
}
