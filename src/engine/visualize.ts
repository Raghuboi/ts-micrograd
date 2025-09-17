import { digraph, toDot } from "ts-graphviz";
import { Value } from "./value.js";

export function trace(root: Value): { nodes: Set<Value>; edges: Set<[Value, Value]> } {
  const nodes = new Set<Value>();
  const edges = new Set<[Value, Value]>();

  function build(v: Value): void {
    if (!nodes.has(v)) {
      nodes.add(v);
      for (const child of v._prev) {
        edges.add([child, v]);
        build(child);
      }
    }
  }

  build(root);
  return { nodes, edges };
}

export function visualize(root: Value): string {
  const { nodes, edges } = trace(root);
  const graph = digraph('G', { rankdir: 'LR' });
  const nodeIds = new Map<Value, string>();

  let counter = 0;
  for (const node of nodes) {
    const uid = `v${counter++}`;
    nodeIds.set(node, uid);

    const label = `${node.tag} | data ${node.data.toFixed(4)} | grad ${node.grad.toFixed(4)}`;
    graph.node(uid, { label, shape: 'record' });

    if (node._op) {
      const opId = `${uid}_op`;
      graph.node(opId, { label: node._op, shape: 'circle' });
      graph.edge([opId, uid]);
    }
  }

  for (const [n1, n2] of edges) {
    const id1 = nodeIds.get(n1);
    const id2 = nodeIds.get(n2);
    if (id1 && id2) {
      const targetId = n2._op ? `${id2}_op` : id2;
      graph.edge([id1, targetId]);
    }
  }

  return toDot(graph);
}

export function generateVisualizationUrl(dotString: string): string {
  const encoded = encodeURIComponent(dotString);
  return `https://dreampuf.github.io/GraphvizOnline/#${encoded}`;
}