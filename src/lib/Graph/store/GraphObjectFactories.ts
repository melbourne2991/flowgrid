import { GraphNode, GraphNodeParams } from "./GraphNode";
import { GraphNodePort, GraphNodePortParams } from "./GraphNodePort";
import { Connection, ConnectionParams } from "./Connection";
import { NewConnection, NewConnectionParams } from "./NewConnection";
import * as shortid from "shortid";

type GraphObjectTypes = {
  GraphNode: {
    params: GraphNodeParams;
    type: GraphNode;
  };
  GraphNodePort: {
    params: GraphNodePortParams;
    type: GraphNodePort;
  };
  Connection: {
    params: ConnectionParams;
    type: Connection;
  };
  NewConnection: {
    params: NewConnectionParams;
    type: NewConnection;
  };
};

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
    return new (typeMap[graphObjectType] as any)(graph, id, params);
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

// type GraphObjectFactories = {
//   [K in keyof GraphObjectTypes]: (id: string, params: GraphObjectTypes[K]['params']) => GraphObjectTypes[K]['type']
// }

// function graphObjectFactories(graph) {
//   return {
//     create: {
//       GraphNode: (id, params: GraphNodeParams) => {
//         return new GraphNode(graph, id, params);
//       },

//       GraphNodePort: (id, params: GraphNodePortParams) => {
//         return new GraphNodePort(graph, id, params);
//       },

//       Connection: (id, params: ConnectionParams) => {
//         return new Connection(graph, id, params);
//       },

//       NewConnection: (id, params: NewConnectionParams) => {
//         return new NewConnection(graph, id, params);
//       }
//     },

//     createWithId: {
//       GraphNode: (params: GraphNodeParams)  => {
//         return graph.create.GraphNode(shortid.generate(), params);
//       },

//       GraphNodePort: (params: GraphNodePortParams) => {
//         return graph.create.GraphNodePort(shortid.generate(), params);
//       },

//       Connection: (params: ConnectionParams) => {
//         return graph.create.Connection(shortid.generate(), params);
//       },

//       NewConnection: (params: NewConnectionParams) => {
//         return graph.create.NewConnection(shortid.generate(), params);
//       }
//     };
//   }
// }
