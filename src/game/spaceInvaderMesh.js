const invaderRows = [
  "00100100",
  "00011000",
  "00111100",
  "01101110",
  "11111111",
  "10111101",
  "10100101",
  "00000000",
];

const vertices = [];
const edges = [];
const vertexIndexes = new Map();
const edgeIndexes = new Set();

function getVertexIndex(x, y, z) {
  const key = `${x},${y},${z}`;
  if (!vertexIndexes.has(key)) {
    vertexIndexes.set(key, vertices.length);
    vertices.push([x, y, z]);
  }
  return vertexIndexes.get(key);
}

function addEdge(start, end) {
  const key = start < end ? `${start},${end}` : `${end},${start}`;
  if (!edgeIndexes.has(key)) {
    edgeIndexes.add(key);
    edges.push([start, end]);
  }
}

invaderRows.forEach((row, y) => {
  [...row].forEach((cell, x) => {
    if (cell !== "1") return;

    const corners = [
      getVertexIndex((x - 4) / 4, (4 - y) / 4, -1),
      getVertexIndex((x - 3) / 4, (4 - y) / 4, -1),
      getVertexIndex((x - 4) / 4, (3 - y) / 4, -1),
      getVertexIndex((x - 3) / 4, (3 - y) / 4, -1),
      getVertexIndex((x - 4) / 4, (4 - y) / 4, 1),
      getVertexIndex((x - 3) / 4, (4 - y) / 4, 1),
      getVertexIndex((x - 4) / 4, (3 - y) / 4, 1),
      getVertexIndex((x - 3) / 4, (3 - y) / 4, 1),
    ];

    [[0, 1], [0, 2], [1, 3], [2, 3], [4, 5], [4, 6], [5, 7], [6, 7],
      [0, 4], [1, 5], [2, 6], [3, 7]].forEach(([from, to]) => {
      addEdge(corners[from], corners[to]);
    });
  });
});

export const spaceInvaderVertices = vertices;
export const spaceInvaderEdges = edges;
