<script setup lang='ts'>
import { ref } from 'vue';

const groups = [
  {
    id: 0,
    content: 'Group 1',
  },
]

const items = [
  {
    id: 2,
    group: 0,
    content: 'item 2',
    start: '2014-04-14',
  },
  {
    id: 3,
    group: 0,
    content: 'item 3',
    start: '2014-04-18',
  },
  {
    id: 1,
    group: 0,
    content: 'item 1',
    start: '2014-04-20',
  },
]

const options = {
  editable: true
}

const edges = [
  { from: 1, to: 3 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
]

const networkEvents = ref('')
const groups_ref = ref(groups)
const items_ref = ref(items)
const options_ref = ref(options)
const edges_ref = ref(edges)

// timeline.value.options = options
// timeline.value.items = items
// timeline.value.groups = groups
function networkEvent(eventName: any) {
  if (networkEvents.value.length > 500) networkEvents.value = '';
  networkEvents.value = `${eventName}, `;
}
</script>

<template lang='pug'>
.w-full
  network(
    ref="timeline"
    class="graph"
    :items="items_ref"
    :groups="groups_ref"

    @click="networkEvent('click')"
    @double-click="networkEvent('doubleClick')"
    @oncontext="networkEvent('oncontext')"
    @hold="networkEvent('hold')"
    @release="networkEvent('release')"
    @select="networkEvent('select')"
    @select-node="networkEvent('selectNode')"
    @select-edge="networkEvent('selectEdge')"
    @deselect-node="networkEvent('deselectNode')"
    @deselect-edge="networkEvent('deselectEdge')"
    @drag-start="networkEvent('dragStart')"
    @dragging="networkEvent('dragging')"
    @drag-end="networkEvent('dragEnd')"
    @hover-node="networkEvent('hoverNode')"
    @blur-node="networkEvent('blurNode')"
    @hover-edge="networkEvent('hoverEdge')"
    @blur-edge="networkEvent('blurEdge')"
    @zoom="networkEvent('zoom')"
    @show-popup="networkEvent('showPopup')"
    @hide-popup="networkEvent('hidePopup')"
    @start-stabilizing="networkEvent('startStabilizing')"
    @stabilization-progress="networkEvent('stabilizationProgress')"
    @stabilization-iterations-done="networkEvent('stabilizationIterationsDone')"
    @stabilized="networkEvent('stabilized')"
    @resize="networkEvent('resize')"
    @init-redraw="networkEvent('initRedraw')"
    @before-drawing="networkEvent('beforeDrawing')"
    @after-drawing="networkEvent('afterDrawing')"
    @animation-finished="networkEvent('animationFinished')"
    @config-change="networkEvent('configChange')"
    @nodes-mounted="networkEvent('nodes-mounted')"
    @nodes-add="networkEvent('nodes-add')"
    @nodes-update="networkEvent('nodes-update')"
    @nodes-remove="networkEvent('nodes-remove')"
    @edges-mounted="networkEvent('edges-mounted')"
    @edges-add="networkEvent('edges-add')"
    @edges-update="networkEvent('edges-update')"
    @edges-remove="networkEvent('edges-remove')"
  )
</template>

<style lang='sass'>
.graph
  width: 100%
  height: 600px
  border: 1px solid #000
</style>