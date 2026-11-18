import { crystalEdges, crystalVertices } from "./crystalMesh";
import { droneEdges, droneVertices } from "./droneMesh";
import { spaceInvaderEdges, spaceInvaderVertices } from "./spaceInvaderMesh";

export const enemyMeshes = {
  invader: {
    vertices: spaceInvaderVertices,
    edges: spaceInvaderEdges,
  },
  drone: {
    vertices: droneVertices,
    edges: droneEdges,
  },
  crystal: {
    vertices: crystalVertices,
    edges: crystalEdges,
  },
};
