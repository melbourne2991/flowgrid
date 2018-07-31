import { GraphNode } from "./GraphNode";
import { GraphNodePort } from "./GraphNodePort";
import { Connection } from "./Connection";
import { NewConnection } from "./NewConnection";

import * as shortid from "shortid";

import { GraphObjectTypes } from "../types";
import { GraphObject } from "./GraphObject";

const typeMap = {
  GraphNode,
  GraphNodePort,
  Connection,
  NewConnection
};

export type GraphObjectFactories = {
  create<K extends keyof GraphObjectTypes>(
    graphObjectType: K,
    id: string,
    params: GraphObjectTypes[K]["params"]
  ): GraphObjectTypes[K]["type"];

  createWithId<K extends keyof GraphObjectTypes>(
    graphObjectType: K,
    params: GraphObjectTypes[K]["params"]
  ): GraphObjectTypes[K]["type"];
};

export function createFactories(graph): GraphObjectFactories {
  function create<K extends keyof GraphObjectTypes>(
    graphObjectType: K,
    id: string,
    params: GraphObjectTypes[K]["params"]
  ): GraphObjectTypes[K]["type"] {
    const obj = new (typeMap[graphObjectType] as any)(
      graph,
      id,
      params
    ) as GraphObjectTypes[K]["type"];

    obj.graphObjectType = graphObjectType;

    return obj;
  }

  function createWithId<K extends keyof GraphObjectTypes>(
    graphObjectType: K,
    params: GraphObjectTypes[K]["params"]
  ): GraphObjectTypes[K]["type"] {
    return create(graphObjectType, shortid.generate(), params);
  }

  return {
    create,
    createWithId
  };
}
