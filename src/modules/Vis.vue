<script setup lang='ts'>
import isEqual from 'lodash/isEqual'
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { Network } from 'vis-network';
import Button from '../components/Button.vue';
import Input from '../components/Input.vue';

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


const stored_items = reactive({
  nodes: localStorage.getItem('nodes'),
  edges: localStorage.getItem('edges'),
})

const create_new_nodes = reactive({
  label: '',
  is_creating: false
})

const create_new_edges = reactive({
  from: '',
  to: ''
})

const graph = ref()
const network = ref<any>(null)
const nodes_ref = ref<VisNodesTypes[]>(JSON.parse(stored_items.nodes || '[]').length ? JSON.parse(stored_items.nodes || '[]') : new_nodes)
const edges_ref = ref<VisEdgesTypes[]>((JSON.parse(stored_items.edges || '[]')).length ? JSON.parse(stored_items.edges || '[]') : new_edges)
const selected_nodes = ref<VisNodesTypes | null>(null)
const update_nodes = ref<VisNodesTypes[] | null>(null)
const is_export_disabled = ref(false)

const graph_computed = computed<VisDataTypes>(() => {
  const input_data: VisNodeCoordinates[] = JSON.parse(stored_items.nodes || '[]')
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

  return {
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
    // console.log('params', params)

    if (!params.nodes.length) {
      selected_nodes.value = null
    }
  })

  network.value.on('click', (params: any) => {
    console.log('params', params)
  })

  network.value.on('doubleClick', (params: any) => {
    const selected_node = params.nodes[0]
    selected_nodes.value = nodes_ref.value.filter((item) => item.id === selected_node)[0]

    let popup: any = document.getElementById('popup')

    if (params.nodes.length > 0) {
      console.log('params', params)

      console.log('edgess', create_new_edges)
      popup.style.left = `${params.pointer.DOM.x}px`
      popup.style.top = `${params.pointer.DOM.y}px`
    } else {
      selected_nodes.value = null
    }
  })

  network.value.on('dragEnd', (params: any) => {
    console.log('params', params)
    update_nodes.value = getUpdatedNodes()
  })
}

const exportNodePosition = () => {
  const nodes = objectToArray(network.value.getPositions())

  if (nodes.length) {
    nodes_ref.value.map((item: any) => {
      item.x = nodes[item.id].x
      item.y = nodes[item.id].y
    })
  }

  localStorage.setItem('nodes', JSON.stringify(nodes_ref.value))
  localStorage.setItem('edges', JSON.stringify(edges_ref.value))
  stored_items.nodes = JSON.stringify(nodes_ref.value)
  update_nodes.value = nodes_ref.value
}

const areEqual = (arr1: VisNodeCoordinates[], arr2: VisNodeCoordinates[]) => isEqual(arr1, arr2);

function objectToArray(obj: any) {
  return Object.keys(obj).map(function (key) {
    obj[key].id = key
    return obj[key]
  })
}

const handleUnselectNodes = () => {
  selected_nodes.value = null
  create_new_edges.from = ''
  create_new_edges.to = ''
  // network.value.getSelection()
}

const handleCreateNewNode = () => {
  let new_nodes = [...graph_computed.value.nodes, {
    id: String(graph_computed.value.nodes.length),
    label: create_new_nodes.label,
    color: '#F3DB89',
    hidden: false
  }]

  let new_edges = [...graph_computed.value.edges, {
    id: String(graph_computed.value.edges.length),
    from: nodes_ref.value.length,
    to: nodes_ref.value.length - 1,
    color: '#000000',
    hidden: false
  }]

  // console.log('new_nodes', new_nodes)
  // console.log('new_edges', new_edges)

  stored_items.nodes = JSON.stringify(new_nodes)
  nodes_ref.value = new_nodes
  console.log('export_text', stored_items.nodes)


  importNodePosition()
  update_nodes.value = getUpdatedNodes()

  create_new_nodes.label = ''
  create_new_nodes.is_creating = false
}


// watch(() => selected_nodes.value, (val) => {
//   console.log('val', val)
//   if (!val) {
//     network.value.releaseNode()
//   }
// })

const getUpdatedNodes = (): VisNodesTypes[] => {
  const updated_nodes = objectToArray(network.value.getPositions())
  const new_nodes = nodes_ref.value.map((item) => {
    return {
      ...item,
      x: updated_nodes[Number(item.id)].x,
      y: updated_nodes[Number(item.id)].y,
    }
  })

  return new_nodes
}

const handleAddNewEdges = () => {
  const filtered_edges = graph_computed.value.edges.filter((item) => {
    item.from === Number(create_new_edges.from)
      && item.to === Number(create_new_edges.to)
    return item
  })

  console.log('filtered_edges', filtered_edges)

  // if (selected_nodes.value && !filtered_edges.length) {
  if (selected_nodes.value) {
    const new_edges = [...graph_computed.value.edges, {
      id: String(graph_computed.value.edges.length),
      from: Number(create_new_edges.from),
      to: Number(create_new_edges.to),
      color: '#000000',
      hidden: false
    }]

    console.log('new_edges', new_edges)

    // graph_computed.value.edges = new_edges
    edges_ref.value = new_edges

    importNodePosition()

    update_nodes.value = getUpdatedNodes()
    handleUnselectNodes()
  }
}

watch(() => update_nodes.value, (val: any) => {
  const export_nodes: VisNodeCoordinates[] = JSON.parse(stored_items.nodes || '[]')

  if (val) is_export_disabled.value = areEqual(val, export_nodes)
}, {
  immediate: true
})

watch(() => selected_nodes.value, (val) => {
  create_new_edges.from = String(val?.id)
})

onMounted(() => {
  if (graph.value) {
    importNodePosition()
    update_nodes.value = getUpdatedNodes()
  }
})
</script>

<template lang='pug'>
.relative.w-full
  .flex.justify-end.gap-4
    div
      Button(@click="create_new_nodes.is_creating = true ") Tambah Node Baru
    div
      Button(@click="network.destroy()") Hapus Seluruh Node
  .grid.grid-cols-4.gap-4.mt-4
    #network(
      ref='graph'
      class="graph col-span-3"
    )
    .col-span-1
      .flex.flex-col.gap-4(v-if="create_new_nodes.is_creating")
        label Nama Node Baru
        .flex.gap-2
          Input.w-full(type="text" v-model="create_new_nodes.label")
          Button.w-24(@click="handleCreateNewNode()") Simpan
      .flex.flex-col.gap-2
        label Import & Export Data
        textarea.border.border-black.rounded(v-model="stored_items.nodes" rows="20")
      .flex.gap-4.mt-4
        Button(:disabled="!stored_items.nodes" @click="importNodePosition()") Import
        Button(:disabled="is_export_disabled" @click="exportNodePosition()") Save Coordinates

    .absolute.z-10.bg-white.p-2.rounded.border#popup(class="min-w-[200px]" :class="{ 'hidden': !selected_nodes }")
      .text-sm ID: {{ selected_nodes?.id || '-'}}
      .text-sm Label: {{ selected_nodes?.label || '-'}}
      .text-sm Color: {{ selected_nodes?.color || '-'}}

      hr.mt-2.mb-2

      .text-sm Add New Edges

      .flex.flex-col.gap-2.mb-2
        label.text-sm(for="from") From
        Input(type="text" id="from" v-model="create_new_edges.from" disabled)
        label.text-sm(for="to") To
        Input(type="text" id="to" v-model="create_new_edges.to")

      Button(@click="handleAddNewEdges()") Add New Edges

      hr.mt-2.mb-2

      Button(@click="handleUnselectNodes()") Unselect
</template>

<style lang='sass'>
.graph
  width: 100%
  height: 600px
  border: 1px solid #000
</style>