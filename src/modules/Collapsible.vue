<script setup lang="ts">
import { computed, reactive, ref } from "vue"

import * as vNG from "v-network-graph"
import { ForceLayout } from "v-network-graph/lib/force-layout"

interface TreeNode extends vNG.Node {
  id: string
  name: string
  collapse?: boolean
  children?: Record<string, TreeNode>
}

type TreeNodes = Record<string, TreeNode>

// const nodeTree: TreeNodes = {
//   groupA: {
//     id: "groupA",
//     name: "Group A",
//     collapse: false,
//     children: {
//       node1: {
//         id: "groupA/node1",
//         name: "Node 1",
//       },
//       node2: {
//         id: "groupA/node2",
//         name: "Node 2",
//       },
//       node3: {
//         id: "groupA/node3",
//         name: "Node 3",
//       },
//     },
//   },
//   groupB: {
//     id: "groupB",
//     name: "Group B",
//     collapse: false,
//     children: {
//       node1: {
//         id: "groupB/node1",
//         name: "Node 1",
//       },
//       node2: {
//         id: "groupB/node2",
//         name: "Node 2",
//       },
//       node3: {
//         id: "groupB/node3",
//         name: "Node 3",
//       },
//     },
//   },
//   groupC: {
//     id: "groupC",
//     name: "Group C",
//     collapse: false,
//     children: {
//       node1: {
//         id: "groupC/node1",
//         name: "Node 1",
//       },
//       node2: {
//         id: "groupC/node2",
//         name: "Node 2",
//       },
//       node3: {
//         id: "groupC/node3",
//         name: "Node 3",
//       },
//     },
//   },
// }

const generateRandomId = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 15)}`;
const generateRandomName = (prefix: string, index: number) => `${prefix} ${index}`;

const generateTree = (numGroups: number, numNodesPerGroup: number): TreeNodes => {
  const tree: TreeNodes = {};

  for (let i = 0; i < numGroups; i++) {
    const groupId = generateRandomId(`group${i}`);
    const groupName = generateRandomName('Group', i);
    const children: { [key: string]: TreeNode } = {};

    for (let j = 0; j < numNodesPerGroup; j++) {
      const nodeId = generateRandomId(`${groupId}/node${j}`);
      const nodeName = generateRandomName('Node', j);
      children[`node${j}`] = { id: nodeId, name: nodeName };
    }

    tree[`group${i}`] = {
      id: groupId,
      name: groupName,
      collapse: false,
      children
    };
  }

  return tree;
};

// Usage
const numGroups = 10; // Number of groups
const numNodesPerGroup = 50; // Number of nodes per group
const nodeTree = generateTree(numGroups, numNodesPerGroup);


const edges: vNG.Edges = {
  edge1: { source: "groupA", target: "groupB" },
  edge2: { source: "groupB", target: "groupC" },
  edge3: { source: "groupC", target: "groupA" },
  // Group A
  edgeA_1: { source: "groupA", target: "groupA/node1" },
  edgeA_2: { source: "groupA", target: "groupA/node2" },
  edgeA_3: { source: "groupA", target: "groupA/node3" },
  // Group B
  edgeB_1: { source: "groupB", target: "groupB/node1" },
  edgeB_2: { source: "groupB", target: "groupB/node2" },
  edgeB_3: { source: "groupB", target: "groupB/node3" },
  // Group C
  edgeC_1: { source: "groupC", target: "groupC/node1" },
  edgeC_2: { source: "groupC", target: "groupC/node2" },
  edgeC_3: { source: "groupC", target: "groupC/node3" },
}

const layouts: vNG.Layouts = {
  nodes: {
    "groupA": { x: 0.0, y: -60.0 },
    "groupA/node1": { x: -86.8, y: -115.5 },
    "groupA/node2": { x: 0.8, y: -163.7 },
    "groupA/node3": { x: 87.2, y: -113.3 },
    "groupB": { x: -53.0, y: 32.0 },
    "groupB/node1": { x: -143.1, y: -15.2 },
    "groupB/node2": { x: -140.5, y: 84.7 },
    "groupB/node3": { x: -53.4, y: 133.8 },
    "groupC": { x: 53.0, y: 32.0 },
    "groupC/node1": { x: 140.7, y: -22.1 },
    "groupC/node2": { x: 144.3, y: 77.8 },
    "groupC/node3": { x: 50.3, y: 132.2 },
  },
}

// Nodes containing parent-child relationships
const nodeTree_ref = reactive(nodeTree)

// Flatten and hide collapsed nodes
const nodes = computed<TreeNodes>(() => {
  const n: TreeNodes = {}
  walkExpandedNodes(nodeTree_ref, node => (n[node.id] = node))
  return n
})

const edges_ref = reactive(edges)
const layouts_ref = reactive<vNG.Layouts>(layouts)
const layoutsBackup: vNG.NodePositions = {}
const zoomLevel = ref(1.0)

const configs = reactive(
  vNG.defineConfigs<TreeNode>({
    view: {
      layoutHandler: new ForceLayout(),
      // grid background
      grid: {
        visible: true,
        interval: 10,
        thickIncrements: 5,
        line: {
          color: "#e0e0e0",
          width: 1,
          dasharray: 1,
        },
        thick: {
          color: "#cccccc",
          width: 1,
          dasharray: 0,
        },
      },
    },
    node: {
      selectable: 2,
      normal: {
        color: n => (n.children ? "#0000cc" : "#8888aa"),
      },
    },
  })
)

const eventHandlers: vNG.EventHandlers = {
  "node:click": ({ node }) => {
    // Perform nodes expand/collapse
    const children = nodes.value[node]?.children
    const parentPos = layouts_ref.nodes[node]
    if (children && parentPos) {
      // Toggle expand/collapse
      nodes.value[node].collapse = !nodes.value[node].collapse
      if (nodes.value[node].collapse) {
        // Backup position relative to parent node
        Object.values(children).forEach(n => {
          const pos = layouts_ref.nodes[n.id]
          layoutsBackup[n.id] = {
            x: pos ? pos.x - parentPos.x : 0,
            y: pos ? pos.y - parentPos.y : 0,
          }
        })
      } else {
        // Restore position relative to parent node
        const z = zoomLevel.value
        Object.values(children).forEach((n, i) => {
          const pos = layoutsBackup[n.id]
          // If no previous position is available, place it at
          // a shifted position from the parent's.
          layouts_ref.nodes[n.id] = {
            x: pos ? pos.x + parentPos.x : parentPos.x + (30 * (i + 1)) / z,
            y: pos ? pos.y + parentPos.y : parentPos.y + (30 * (i + 1)) / z,
          }
          delete layoutsBackup[n.id]
        })
      }
    }
  },
}

// Place +/- badge layer over nodes layer
const layers: vNG.Layers = { badge: "nodes" }

function walkExpandedNodes(nodes: TreeNodes, cb: (node: TreeNode) => void) {
  for (const n of Object.values(nodes)) {
    cb(n)
    if (!n.collapse && n.children) {
      walkExpandedNodes(n.children, cb)
    }
  }
}

const nextNodeIndex = ref(Object.keys(nodes).length + 1)
const nextEdgeIndex = ref(Object.keys(edges).length + 1)

const selectedNodes = ref<string[]>([])
const selectedEdges = ref<string[]>([])

function addNode() {
  const nodeId = `node${nextNodeIndex.value}`
  const name = `N${nextNodeIndex.value}`
  // nodes[nodeId] = { name }
  nextNodeIndex.value++
}

function addEdge() {
  if (selectedNodes.value.length !== 2) return
  const [source, target] = selectedNodes.value
  const edgeId = `edge${nextEdgeIndex.value}`
  edges[edgeId] = { source, target }
  nextEdgeIndex.value++
}

function removeEdge() {
  for (const edgeId of selectedEdges.value) {
    delete edges[edgeId]
  }
}
</script>

<template lang="pug">
.w-full
  .flex.gap-4.my-4
    button(class="btn-demo mr-auto" @click="graphRef?.fitToContents()") click Fit
    .flex.items-center.gap-2
      label Node:
      button(class="btn-demo" @click="addNode") add
      button(class="btn-demo" :disabled="selectedNodes.length == 0" @click="removeNode") remove

    .flex.items-center.gap-2
      label Edge:
      button(class="btn-demo" :disabled="selectedNodes.length != 2" @click="addEdge") add
      button(class="btn-demo" :disabled="selectedEdges.length == 0" @click="removeEdge") remove

  .flex.flex-col.gap-4
    VNetworkGraph(
      class="graph"
      :nodes="nodes"
      :edges="edges_ref"
      :configs="configs"
      :layers="layers"
      :layouts="layouts"
      :event-handlers="eventHandlers"
      v-model:zoomLevel="zoomLevel"
    )
      template(#badge="{ scale }")
        template(v-for="(pos, node) in layouts_ref.nodes" :key="node")
          g(
            v-if="nodes[node]?.children"
            class="collapse-badge"
            :transform="`translate(${pos.x + 9 * scale}, ${pos.y - 9 * scale})`"
          )
            circle(
              :cx="0"
              :cy="0"
              :r="7 * scale"
              :fill="nodes[node].collapse ? '#00cc00' : '#ff5555'")
            text(text-anchor="middle" :transform="`scale(${scale})`")
              template(v-if="nodes[node].collapse") +
              template(v-else) -
</template>

<style lang="sass">
.btn-demo
  @apply bg-white rounded p-2 border cursor-pointer hover:bg-slate-200
.graph
  width: 100%
  height: 600px
  border: 1px solid #000

.context-menu
  @apply w-[225px] bg-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.15)] rounded p-3 fixed invisible
  &--options
    @apply mt-3 flex flex-col gap-2
    &--item
      @apply text-sm cursor-pointer
  &--more
    @apply mt-4 text-sm font-bold text-[#56C9CA] cursor-pointer

.collapse-badge
  pointer-events: none

.collapse-badge text
  font-size: 14px
  stroke: #fff
  text-anchor: middle
  dominant-baseline: middle
</style>
