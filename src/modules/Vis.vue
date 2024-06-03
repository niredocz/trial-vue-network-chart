<script setup lang='ts'>
import isEqual from 'lodash/isEqual'
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { Network } from 'vis-network';
import Button from '../components/Button.vue';

import { new_nodes, new_edges } from '../constant/vis-data'
import type { VisNodesTypes, VisEdgesTypes, VisDataTypes } from '../types/vis-types'

type VisNodeCoordinates = {
  x: number
  y: number
  id: string
}

const options = reactive({
  manipulation: {
    enabled: true,
    initiallyActive: true,
  },
  nodes: {
    shape: "circle",
    margin: {
      top: 10,
      bottom: 10,
      right: 14,
      left: 14,
    },
    font: {
      size: 18,
      color: "#000000",
    },
    borderWidth: 2,
  },
  edges: {
    width: 1,
    length: 300,
    smooth: {
      enabled: true,
      roundness: 1
    },
    arrows: {
      to: {
        enabled: true
      }
    }
  },
  physics: {
    enabled: false,
    barnesHut: {
      avoidOverlap: .5
    }
  }
})

const graph = ref()
const network = ref<any>(null)
const nodes_ref = ref(new_nodes)
const edges_ref = ref(new_edges)
const export_text = ref(localStorage.getItem('nodes'))
const selected_nodes = ref<VisNodesTypes | null>(null)
const update_nodes = ref<VisNodeCoordinates[] | null>(null)
const is_disabled = ref(false)

const graph_computed = computed<VisDataTypes>(() => {
  const input_data: VisNodeCoordinates[] = JSON.parse(export_text.value || '[]')
  let nodes_value: VisNodesTypes[] = []

  input_data.length && input_data.forEach((data: VisNodeCoordinates) => {
    let nodes: VisNodesTypes = nodes_ref.value.filter((item) => item.id === data.id)[0]

    if (nodes) {
      nodes = {
        ...nodes,
        x: data.x,
        y: data.y
      }
    }

    nodes_value.push(nodes)
  })

  // input_data.length && nodes_ref.value.forEach((data: VisNodesTypes) => {
  //   let nodes: any = input_data.filter((item) => item.id !== data.id)[0]

  //   console.log('nodes', nodes)
  // })

  // console.log('nodes', nodes_value)

  return {
    // nodes: nodes,
    nodes: nodes_value.length ? nodes_value : nodes_ref.value,
    edges: edges_ref.value
  }
})

function generateNodes(numGroups: number, nodesPerGroup: number) {
  const nodes = [];
  let idCounter = 0;

  for (let group = 0; group < numGroups; group++) {
    for (let node = 0; node < nodesPerGroup; node++) {
      nodes.push({
        id: idCounter,
        label: idCounter.toString(),
        group: group,
      });
      idCounter++;
    }
  }

  return nodes;
}

const importNodePosition = () => {
  network.value = new Network(graph.value, graph_computed.value, options as any)

  network.value.on('select', (params: any) => {
    const selected_node = params.nodes[0]
    selected_nodes.value = nodes_ref.value.filter((item) => item.id === selected_node)[0]
  })

  network.value.on('dragEnd', (params: any) => {
    console.log('params', params)
    update_nodes.value = objectToArray(network.value.getPositions())
  })
}

const exportNodePosition = () => {
  const nodes = objectToArray(network.value.getPositions())

  localStorage.setItem('nodes', JSON.stringify(nodes))
  export_text.value = JSON.stringify(nodes)
  update_nodes.value = nodes
}

// const nodes = generateNodes(100, 1);
// console.log('nodes', nodes)

const areEqual = (arr1: VisNodeCoordinates[], arr2: VisNodeCoordinates[]) => isEqual(arr1, arr2);

function objectToArray(obj: any) {
  return Object.keys(obj).map(function (key) {
    obj[key].id = key
    return obj[key]
  })
}

const handleUnselectNodes = () => {
  selected_nodes.value = null
  // network.value.getSelection()
}


// watch(() => selected_nodes.value, (val) => {
//   console.log('val', val)
//   if (!val) {
//     network.value.releaseNode()
//   }
// })

watch(() => update_nodes.value, (val) => {
  const export_nodes: VisNodeCoordinates[] = JSON.parse(export_text.value || '[]')

  if (val) is_disabled.value = areEqual(val, export_nodes)
}, {
  immediate: true
})

onMounted(() => {
  if (graph.value) {
    importNodePosition()
    update_nodes.value = objectToArray(network.value.getPositions())


  }
})
</script>

<template lang='pug'>
.relative.w-full
  .flex.justify-end.gap-4
    div
      Button(@click="network.destroy()") Hapus Seluruh Node
  .grid.grid-cols-4.gap-4
    #network(
      ref='graph'
      class="graph col-span-3"
    )
    .col-span-1
      .flex.flex-col.gap-2
        label Import & Export Data
        textarea.border.border-black.rounded(v-model="export_text" rows="20")
      .flex.gap-4.mt-4
        Button(:disabled="!export_text" @click="importNodePosition()") Import
        Button(:disabled="is_disabled" @click="exportNodePosition()") Save Coordinates
.absolute.top-0.left-0.w-full.h-full(v-if="selected_nodes" class="bg-black/15" @click="handleUnselectNodes()")
  .absolute.top-0.right-0.bg-white.w-full.h-full.p-4(class="max-w-[300px]")
    .mt-4
      .font-semibold Target ID:
      span {{ selected_nodes?.id }}
    .mt-4
      .font-semibold Target Name:
      span {{ selected_nodes?.label }}
    .mt-4
      .font-semibold Target Color:
      span {{ selected_nodes?.color }}
    
</template>

<style lang='sass'>
.graph
  width: 100%
  height: 600px
  border: 1px solid #000
</style>