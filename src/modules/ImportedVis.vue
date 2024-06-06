<script setup lang='ts'>
import { reactive, ref, watch } from 'vue';
import Graph from '../components/Graph.vue'
import { new_nodes, new_edges, color } from '../constant/vis-data'
import type { VisEdgesTypes, VisNodesTypes } from '../types/vis-types';

import Button from '../components/Button.vue';
import Input from '../components/Input.vue';


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

const update_edge_label = reactive({
  id: '',
  text: '',
  is_editing: false
})

const nodes_ref = ref<VisNodesTypes[]>(JSON.parse(stored_items.nodes || '[]').length ? JSON.parse(stored_items.nodes || '[]') : new_nodes)
const edges_ref = ref<VisEdgesTypes[]>((JSON.parse(stored_items.edges || '[]')).length ? JSON.parse(stored_items.edges || '[]') : new_edges)
const is_export_disabled = ref(false)
const my_graph = ref<any>()

const handleExportNode = (val: VisNodesTypes[]) => {
  console.log('val parent', val)
  localStorage.setItem('nodes', JSON.stringify(val))
  localStorage.setItem('edges', JSON.stringify(edges_ref.value))
  stored_items.nodes = JSON.stringify(val)
}

const handleCreateNewNode = (val : VisNodesTypes[]) => {
  console.log('new node', val)
  stored_items.nodes = JSON.stringify(val)
  nodes_ref.value = val
}

const handleCreateNewEdge = (val : VisEdgesTypes[]) => {
  console.log('new node', val)
  stored_items.edges = JSON.stringify(val)
  edges_ref.value = val
}

const saveCoordinates = () => my_graph.value && my_graph.value.exportNodePosition()
const importCoordinates = () => my_graph.value && my_graph.value.importNodePosition()
const createNewNodes = () => my_graph.value && my_graph.value.handleCreateNewNode()
</script>

<template lang='pug'>
.relative.w-full
  .flex.justify-end.gap-4
    div
      Button(@click="create_new_nodes.is_creating = true ") Tambah Node Baru
    div
      Button(@click="network.destroy()") Hapus Seluruh Node

  .grid.grid-cols-4.gap-4.mt-4
    .col-span-3
      Graph(
        ref="my_graph"
        v-model:is_export_disabled="is_export_disabled"
        :nodes="nodes_ref"
        :edges="edges_ref"
        :create_new_nodes="create_new_nodes"
        :create_new_edges="create_new_edges"
        :update_edge_label="update_edge_label"
        @exportNodePosition="handleExportNode"
        @onCreateNewNode="handleCreateNewNode"
        @onCreateNewEdge="handleCreateNewEdge"
      )
    .col-span-1
      .flex.flex-col.gap-4(v-if="create_new_nodes.is_creating")
        label Nama Node Baru
        .flex.gap-2
          Input.w-full(type="text" v-model="create_new_nodes.label")
          Button.w-24(@click="createNewNodes()") Simpan
      .flex.flex-col.gap-2
        label Import & Export Data
        textarea.border.border-black.rounded(v-model="stored_items.nodes" rows="20")
      .flex.gap-4.mt-4
        Button(:disabled="!stored_items.nodes" @click="importCoordinates()") Import
        Button(:disabled="is_export_disabled" @click="saveCoordinates()") Save Coordinates
  //- p nodes_ref: {{ nodes_ref }}
</template>