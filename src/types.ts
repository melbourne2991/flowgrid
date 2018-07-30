export type Dict<T> = {
  [key: string]: T;
};

export type SerializeableDict = {
  [key: string]: string | number | SerializeableDict;
};

export interface Serializeable<T> {
  serialize(): T;
  deserialize(serializedObject: T): void;
}
