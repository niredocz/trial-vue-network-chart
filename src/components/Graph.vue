<script setup lang='ts'>
import isEqual from 'lodash/isEqual'
import { type PropType, computed, onMounted, reactive, ref, watch } from 'vue';
import { Network } from 'vis-network';
import Button from '../components/Button.vue';
import Input from '../components/Input.vue';

import { new_nodes, new_edges, color } from '../constant/vis-data'
import type { VisNodesTypes, VisEdgesTypes, VisDataTypes } from '../types/vis-types'

type VisNodeCoordinates = {
  x: number
  y: number
  id: string
}

const props = defineProps({
  nodes: {
    type: Array as PropType<VisNodesTypes[]>,
    default: () => []
  },
  edges: {
    type: Array as PropType<VisEdgesTypes[]>,
    default: () => []
  },
  options: {
    type: Object,
    default: () => { }
  },
  // onSelect: {
  //   type: Function,
  //   default: () => {}
  // },
  create_new_nodes: {
    type: Object,
    default: () => { }
  },
  create_new_edges: {
    type: Object,
    default: () => { }
  },
  update_edge_label: {
    type: Object,
    default: () => { }
  },
  is_export_disabled: {
    type: Boolean,
    default: false
  },
  // handleCreateNewNode: {
  //   type: Function,
  //   default: () => {}
  // },
  // handleCreateNewEdge: {
  //   type: Function,
  //   default: () => {}
  // },
  // handleUpdateEdgeLabel: {
  //   type: Function,
  //   default: () => {}
  // },
  // handleUnselectNodes: {
  //   type: Function,
  //   default: () => {}
  // },
  // handleUnselectEdges: {
  //   type: Function,
  //   default: () => {}
  // },
})

const emit = defineEmits<{
  (e: 'update:nodes', value: VisNodesTypes[]): void
  (e: 'update:edges', value: VisEdgesTypes[]): void
  (e: 'update:is_export_disabled', value: boolean): void
  (e: 'exportEdgePosition', value: VisEdgesTypes[]): void // NOT WORKING YET
  (e: 'exportNodePosition', value: VisNodesTypes[]): void // TODO: return exported nodes
  (e: 'updateEdgeLabel', value: VisEdgesTypes): void // NOT WORKING YET
  (e: 'onCreateNewNode', value: VisNodesTypes[]): void
  (e: 'onCreateNewEdge', value: VisEdgesTypes[]): void
}>()

const options = reactive({
  ...props.options,
  // manipulation: {
  //   enabled: true,
  //   initiallyActive: true,
  // },
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
      color: "#FFFFFF",
    },
    // borderWidth: 2,
  },
  edges: {
    width: 2,
    length: 300,
    smooth: {
      enabled: true,
      roundness: 1
    },
  },
  physics: {
    enabled: false,
    barnesHut: {
      avoidOverlap: .5
    }
  }
})

const create_new_nodes = reactive(props.create_new_nodes)
const create_new_edges = reactive(props.create_new_edges)
const update_edge_label = reactive(props.update_edge_label)
const update_value = reactive<{
  nodes: VisNodesTypes[]
  edges: VisEdgesTypes[]
}>({
  nodes: [],
  edges: []
})

const graph = ref()
const network = ref<any>(null)
const nodes_ref = ref<VisNodesTypes[]>(props.nodes)
const edges_ref = ref<VisEdgesTypes[]>(props.edges)
const selected_nodes = ref<VisNodesTypes | null>(null)

const graph_computed = computed<VisDataTypes>(() => {
  return {
    nodes: nodes_ref.value,
    edges: edges_ref.value
  }
})

const areEqual = (arr1: VisNodesTypes[] | VisEdgesTypes[], arr2: VisNodesTypes[] | VisEdgesTypes[]) => isEqual(arr1, arr2);

function objectToArray(obj: any) {
  return Object.keys(obj).map(function (key) {
    obj[key].id = key
    return obj[key]
  })
}

const importNodePosition = () => {
  network.value = new Network(graph.value, graph_computed.value, options as any)

  // network.value.enableEditMode()

  network.value.on('select', (params: any) => {
    if (!params.nodes.length) {
      selected_nodes.value = null
    }
  })

  network.value.on('doubleClick', (params: any) => {
    console.log('params', params)
  })

  network.value.on('oncontext', (params: any) => {
    params.event.preventDefault()
    const selected_node = params.nodes[0]
    selected_nodes.value = nodes_ref.value.filter((item) => item.id === selected_node)[0]

    let popup: any = document.getElementById('popup')

    if (params.nodes.length > 0) {
      popup.style.left = `${params.pointer.DOM.x}px`
      popup.style.top = `${params.pointer.DOM.y + 50}px`
    } else {
      selected_nodes.value = null
    }
  })

  network.value.on('dragEnd', () => {
    update_value.nodes = getUpdatedNodes()
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

  emit('exportNodePosition', nodes_ref.value)

  // localStorage.setItem('nodes', JSON.stringify(nodes_ref.value))
  // localStorage.setItem('edges', JSON.stringify(edges_ref.value))
  // stored_items.nodes = JSON.stringify(nodes_ref.value)
  update_value.nodes = nodes_ref.value
}

const handleUnselectNodes = () => {
  selected_nodes.value = null
  create_new_edges.from = ''
  create_new_edges.to = ''
  // network.value.getSelection()
}

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

const handleCreateNewNode = () => {
  if (create_new_nodes.label) {
    let new_nodes = [...graph_computed.value.nodes, {
      id: String(graph_computed.value.nodes.length),
      label: create_new_nodes.label,
      color: color[2],
      hidden: false
    }] as VisNodesTypes[]

    // let new_edges = [...graph_computed.value.edges, {
    //   id: String(graph_computed.value.edges.length),
    //   from: nodes_ref.value.length,
    //   to: nodes_ref.value.length - 1,
    //   color: color[3],
    //   hidden: false
    // }]

    emit('onCreateNewNode', new_nodes)

    // stored_items.nodes = JSON.stringify(new_nodes)
    nodes_ref.value = new_nodes

    importNodePosition()
    update_value.nodes = getUpdatedNodes()

    create_new_nodes.label = ''
    create_new_nodes.is_creating = false
  }
}

const handleCreateNewEdge = () => {
  const filtered_edges = graph_computed.value.edges.filter((item) => {
    item.from === Number(create_new_edges.from)
      && item.to === Number(create_new_edges.to)
    return item
  })

  // if (selected_nodes.value && !filtered_edges.length) {
  if (selected_nodes.value) {
    const new_edges = [...graph_computed.value.edges, {
      id: String(graph_computed.value.edges.length),
      from: Number(create_new_edges.from),
      to: Number(create_new_edges.to),
      color: color[2],
      hidden: false
    }]



    emit('onCreateNewEdge', new_edges)

    edges_ref.value = new_edges

    importNodePosition()

    // update_value.nodes = getUpdatedNodes()
    handleUnselectNodes()
  }
}

// watch(() => selected_nodes.value, (val) => {
//   console.log('val', val)
//   if (!val) {
//     network.value.releaseNode()
//   }
// })

watch(() => update_value.nodes, (val_nodes: any) => {
  // const export_nodes: VisNodeCoordinates[] = JSON.parse(stored_items.nodes || '[]')
  const export_nodes: VisNodesTypes[] = nodes_ref.value
  // const export_edges: VisEdgesTypes[] = edges_ref.value

  // console.log('vvll', val_edges, areEqual(val_edges, export_edges))

  if (val_nodes) {
    // is_export_disabled.value = areEqual(val, export_nodes)
    emit('update:is_export_disabled', areEqual(val_nodes, export_nodes))
  }

  // if (val_edges) {
  //   emit('update:is_export_disabled', areEqual(val_edges, export_edges))
  // }
}, {
  deep: true,
  immediate: true
})

watch(() => edges_ref.value, (val_edges: any) => {
  // const export_nodes: VisNodeCoordinates[] = JSON.parse(stored_items.nodes || '[]')
  // const export_nodes: VisNodesTypes[] = nodes_ref.value
  const export_edges: VisEdgesTypes[] = edges_ref.value

  // console.log('vvll', val_edges, areEqual(val_edges, export_edges))

  if (val_edges) {
    // is_export_disabled.value = areEqual(val, export_nodes)
    emit('update:is_export_disabled', areEqual(val_edges, export_edges))
  }

  // if (val_edges) {
  //   emit('update:is_export_disabled', areEqual(val_edges, export_edges))
  // }
}, {
  deep: true,
  immediate: true
})

watch(() => selected_nodes.value, (val) => {
  create_new_edges.from = String(val?.id)
})

onMounted(() => {
  if (graph.value) {
    importNodePosition()
    update_value.nodes = getUpdatedNodes()
  }
})

defineExpose({
  importNodePosition,
  exportNodePosition,
  handleCreateNewNode
})
</script>

<template lang='pug'>
//- .flex.justify-end.gap-4
  div
    Button(@click="create_new_nodes.is_creating = true ") Tambah Node Baru
  div
    Button(@click="network.destroy()") Hapus Seluruh Node

.grid.grid-cols-4.gap-4.mt-4
  .col-span-4#network(
    ref='graph'
    class="graph"
  )
  Button(@click="network.editEdgeMode()") click me
  //- .col-span-1
    .flex.flex-col.gap-4(v-if="create_new_nodes.is_creating")
      label Nama Node Baru
      .flex.gap-2
        Input.w-full(type="text" v-model="create_new_nodes.label")
        Button.w-24(@click="handleCreateNewNode()") Simpan
    //- .flex.flex-col.gap-2
      label Import & Export Data
      textarea.border.border-black.rounded(v-model="stored_items.nodes" rows="20")
    //- .flex.gap-4.mt-4
      Button(:disabled="!stored_items.nodes" @click="importNodePosition()") Import
      Button(:disabled="is_export_disabled" @click="exportNodePosition()") Save Coordinates

  //- .absolute.z-10.bg-white.rounded.border#popup(class="w-[200px]" :class="{ 'hidden': !update_edge_label.is_editing }")
    .p-2
      label.text-sm(for="from") From
      Input(type="text" id="from" v-model="update_edge_label.text")
  .absolute.z-10.bg-white.rounded.border#popup(class="w-[200px]" :class="{ 'hidden': !selected_nodes }")
    .p-2
      .text-sm ID: {{ selected_nodes?.id || '-'}}
      .text-sm Label: {{ selected_nodes?.label || '-'}}
      .text-sm Color: {{ selected_nodes?.color || '-'}}
    hr
    .p-2
      .text-sm Add New Edges
      .flex.gap-2.mb-2
        div
          label.text-sm(for="from") From
          Input(type="text" id="from" v-model="create_new_edges.from" disabled)
        div
          label.text-sm(for="to") To
          Input(type="text" id="to" v-model="create_new_edges.to")
      Button(@click="handleCreateNewEdge()") Add New Edges
      hr.mt-2.mb-2
      Button(@click="handleUnselectNodes()") Unselect
</template>

<style lang='sass' scoped>
.graph
  width: 100%
  height: 600px
  border: 1px solid #000
  background-color: #161F11
</style>