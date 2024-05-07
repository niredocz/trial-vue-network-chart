<script setup lang="ts">
import { defineConfigs } from "v-network-graph";
import * as vNG from "v-network-graph";
import { ref } from "vue";
import Input from "./components/Input.vue";

const convert = ["KTP", "KK", "BPJS", "NPWP", "Phone Number"];

const edges = {
  edge1: { source: "node2", target: "node1" },
  edge2: { source: "node3", target: "node1" },
  edge3: { source: "node4", target: "node1" },
  edge4: { source: "node5", target: "node1" },
  edge5: { source: "node6", target: "node1" },
  edge6: { source: "node7", target: "node1" },
  edge7: { source: "node8", target: "node1" },
  edge8: { source: "node9", target: "node1" },
};

const layouts = {
  nodes: {
    node1: { x: 0, y: 0 },
    node2: { x: 0, y: -150 },
    node3: { x: 150, y: -150 },
    node4: { x: 150, y: 0 },
    node5: { x: 150, y: 150 },
    node6: { x: 0, y: 150 },
    node7: { x: -150, y: 150 },
    node8: { x: -150, y: 0 },
    node9: { x: -150, y: -150 },
  },
};

const configs = defineConfigs({
  // node: {
  //   selectable: true,
  //   normal: {
  //     type: "rect",
  //     width: 100,
  //     height: 32,
  //     borderRadius: 8,
  //   },
  // },
  node: {
    normal: {
      type: "rect",
      color: (node) => node.color,
      radius: 4,
      width: (node) => displayTextWidth(node?.name || ""),
    },
    label: {
      fontSize: 14,
      color: "#202428",
      direction: "center",
    },
    hover: {
      color: (node) => node.color,
    },
  },
  edge: {
    normal: {
      width: 1.5,
      color: "#000000",
    },
    hover: {
      color: "#000000",
    },
    marker: {
      source: {
        type: "arrow",
        width: 4,
        height: 4,
        margin: -1,
        offset: 0,
        units: "strokeWidth",
        color: null,
      },
    },
  },
});

const nodes: any = {
  node1: { id: "node1", name: "317123456789004", color: "#56C9CA" },
  node2: { id: "node2", name: "Eko Pujianto", color: "#D9E1E9" },
  node3: { id: "node3", name: "Perempuan", color: "#D9E1E9" },
  node4: { id: "node4", name: "Islam", color: "#D9E1E9" },
  node5: { id: "node5", name: "WNI", color: "#D9E1E9" },
  node6: { id: "node6", name: "Kalideres", color: "#D9E1E9" },
  node7: { id: "node7", name: "317123456789004", color: "#F3DB89" },
  node8: { id: "node8", name: "A9601796", color: "#F3DB89" },
  node9: { id: "node9", name: "083866817535", color: "#F3DB89" },
};

function displayTextWidth(text: string) {
  const canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  if (ctx) ctx.font = "14px";
  const text_result = ctx?.measureText(text);
  const text_width = text_result?.width || 0;
  return text_width + 55;
}

function showContextMenu(element: HTMLElement, event: MouseEvent) {
  element.style.left = event.x + "px";
  element.style.top = event.y + "px";
  element.style.visibility = "visible";
  const handler = (event: PointerEvent) => {
    if (!event.target || !element.contains(event.target as HTMLElement)) {
      element.style.visibility = "hidden";
      document.removeEventListener("pointerdown", handler, { capture: true });
    }
  };
  document.addEventListener("pointerdown", handler, {
    passive: true,
    capture: true,
  });
}

const nodeMenu = ref<HTMLDivElement>();
const menuTargetNode = ref("");
function showNodeContextMenu(params: vNG.NodeEvent<MouseEvent>) {
  const { node, event } = params;
  // Disable browser's default context menu
  event.stopPropagation();
  event.preventDefault();
  if (nodeMenu.value) {
    menuTargetNode.value = nodes[node].name ?? "";
    showContextMenu(nodeMenu.value, event);
  }
}

const eventHandlers: vNG.EventHandlers = {
  "node:click": ({ node, event }) => {
    showNodeContextMenu({ event: event, node: node });
  },
};
</script>

<template lang="pug">
VNetworkGraph(class="graph" :nodes="nodes" :edges="edges" :layouts="layouts" :configs="configs" :event-handlers="eventHandlers")

div(ref="nodeMenu" class="context-menu")
  Input
  .context-menu--options 
    .context-menu--options--item(v-for="(item, key) in convert" :key="key" class="hover:text-[#202428] text-[#9FB3C8]")
      span.font-bold Passport 
      span.font-normal to 
      span.font-bold {{ item }}
  .context-menu--more More
</template>

<style lang="sass">
.graph
  width: 800px
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

  // width: 180px
  // background-color: #efefef
  // padding: 10px
  // position: fixed
  // visibility: hidden
  // font-size: 12px
  // border: 1px solid #aaa
  // box-shadow: 2px 2px 2px #aaa
  // > div
  //   border: 1px dashed #aaa
  //   padding: 4px
  //   margin-top: 8px
</style>
