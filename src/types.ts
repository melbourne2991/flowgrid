export type Dict<T> = {
  [key: string]: T;
};

export type SerializeableDict = {
  [key: string]: string | number | SerializeableDict;
};

export interface SerializeableObject<T> {
  serialize(): T;
  deserialize(serializedObject: T): void;
}

export type Serializeable = SerializeableObject<any> | SerializeableDict;
