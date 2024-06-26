<script setup lang="ts">
import { reactive, ref, watch } from "vue"
import * as vNG from "v-network-graph"
import {
  ForceLayout,
  // ForceNodeDatum,
  // ForceEdgeDatum,
} from "v-network-graph/lib/force-layout"

const nodeCount = ref(20)
const nodes = reactive({})
const edges = reactive({})

// initialize network
buildNetwork(nodeCount.value, nodes, edges)

watch(nodeCount, () => {
  buildNetwork(nodeCount.value, nodes, edges)
})

const configs = reactive(
  vNG.defineConfigs({
    view: {
      layoutHandler: new ForceLayout({
        positionFixedByDrag: false,
        positionFixedByClickWithAltKey: true,
        createSimulation: (d3, nodes, edges) => {
          // d3-force parameters
          const forceLink = d3.forceLink<any>(edges).id((d: any) => d.id)
          return d3
            .forceSimulation(nodes)
            .force("edge", forceLink.distance(40).strength(0.5))
            .force("charge", d3.forceManyBody().strength(-800))
            .force("center", d3.forceCenter().strength(0.05))
            .alphaMin(0.001)

          // * The following are the default parameters for the simulation.
          // const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id(d => d.id)
          // return d3
          //   .forceSimulation(nodes)
          //   .force("edge", forceLink.distance(100))
          //   .force("charge", d3.forceManyBody())
          //   .force("collide", d3.forceCollide(50).strength(0.2))
          //   .force("center", d3.forceCenter().strength(0.05))
          //   .alphaMin(0.001)
        }
      }),
    },
    node: {
      label: {
        visible: false,
      },
    },
  })
)

function buildNetwork(count: number, nodes: vNG.Nodes, edges: vNG.Edges) {
  const idNums = [...Array(count)].map((_, i) => i)

  // nodes
  const newNodes = Object.fromEntries(idNums.map(id => [`node${id}`, {}]))
  Object.keys(nodes).forEach(id => delete nodes[id])
  Object.assign(nodes, newNodes)

  // edges
  const makeEdgeEntry = (id1: number, id2: number) => {
    return [`edge${id1}-${id2}`, { source: `node${id1}`, target: `node${id2}` }]
  }
  const newEdges = Object.fromEntries([
    ...idNums
      .map(n => [n, (Math.floor(n / 4) * 4) % count])
      .map(([n, m]) => (n === m ? [n, (n + 4) % count] : [n, m]))
      .map(([n, m]) => makeEdgeEntry(n, m)),
  ])
  Object.keys(edges).forEach(id => delete edges[id])
  Object.assign(edges, newEdges)
}
</script>

<template lang="pug">
.w-full
  .flex.flex-col.gap-4
    button(@click="addNewNodes" class="w-fit bg-blue-500 text-white px-4 py-2") Add New Node
    div
      label Node count:
      el-input-number(v-model="nodeCount" :min="3" :max="200")
      label (&lt;= 200)

    VNetworkGraph.graph(
      :zoom-level="0.5"
      :nodes="nodes"
      :edges="edges"
      :configs="configs"
    )
</template>

<style lang="sass">
.graph
  width: 800px
  height: 600px
  border: 1px solid #000
</style>