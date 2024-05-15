<script setup lang="ts">
import { defineConfigs } from "v-network-graph";
import * as vNG from "v-network-graph";
import { computed, ref } from "vue";
import Input from "../components/Input.vue";

const convert = ["KTP", "KK", "BPJS", "NPWP", "Phone Number"];

type NodeType = {
  [key: string]: {
    id: string
    name: string
    color: string
  }
}

type EdgeType = {
  [key: string]: {
    source: string
    target: string
  }
}

type LayoutsType = {
  nodes: {
    [key: string]: {
      x: number
      y: number
    }
  }
}

const edges: EdgeType = {
  edge1: { source: "node2", target: "node1" },
  edge2: { source: "node3", target: "node1" },
  edge3: { source: "node4", target: "node1" },
  edge4: { source: "node5", target: "node1" },
  edge5: { source: "node6", target: "node1" },
  edge6: { source: "node7", target: "node1" },
  edge7: { source: "node8", target: "node1" },
  edge8: { source: "node9", target: "node1" },
};

const layouts: LayoutsType = {
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
  path: {
    normal: {
      animate: false,
    }
  }
});

const nodes: NodeType = {
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
const nodes_ref = ref(nodes)
const edges_ref = ref(edges)
const layouts_ref = ref(layouts)

function showNodeContextMenu(params: vNG.NodeEvent<MouseEvent>) {
  const { node, event } = params;
  // Disable browser's default context menu
  event.stopPropagation();
  event.preventDefault();
  // console.log('param', nodes_ref.value[params.node])

  if (nodes_ref.value[params.node].color !== "#F3DB89") return

  if (nodeMenu.value) {
    menuTargetNode.value = nodes_ref.value[node].name ?? "";
    showContextMenu(nodeMenu.value, event);
  }
}

const eventHandlers: vNG.EventHandlers = {
  "node:click": ({ node, event }) => {
    showNodeContextMenu({ event: event, node: node });
  },
};

const nextNodeIndex = computed(() => Object.keys(nodes_ref.value).length + 1);
const nextEdgeIndex = computed(() => Object.keys(edges_ref.value).length + 1);

// function generateRandomOffset(range: number) {
//   return {
//     x: Math.floor(Math.random() * range) - range / 2,
//     y: Math.floor(Math.random() * range) - range / 2,
//   };
// }

function generateRandomOffset(min: number, max: number) {
  const randomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const sign = () => (Math.random() < 0.5 ? -1 : 1);

  return {
    x: randomInRange(min, max) * sign(),
    y: randomInRange(min, max) * sign(),
  };
}

function addNode(value: {
  id: string
  name: string
  color: string
  target: string
}, range: number) {
  const new_nodes = {
    ...nodes_ref.value,
    [value.id]: {
      id: value.id,
      name: value.name,
      color: value.color
    }
  }

  const new_edges = {
    ...edges_ref.value,
    [value.id]: {
      source: value.id,
      target: value.target
    }
  }

  const targetNodePosition: any = layouts_ref.value.nodes[value.target];

  const offset = generateRandomOffset(100, range);

  const newNodePosition = {
    x: targetNodePosition.x + offset.x,
    y: targetNodePosition.y + offset.y,
  };

  console.log('newNodePosition', newNodePosition)

  const new_layouts = {
    nodes: {
      ...layouts_ref.value.nodes,
      [value.id]: newNodePosition
    }
  }

  nodes_ref.value = new_nodes
  edges_ref.value = new_edges
  layouts_ref.value = new_layouts
}

const addNewNodes = () => {
  addNode({
    id: `node${nextNodeIndex.value}`,
    name: "INI NODE BARU",
    color: "#F3DB89",
    target: `node9`,
  }, 200)
}

const generateAxis = (node: any) => {
  const { x, y } = node
}
</script>

<template lang="pug">
.w-full
  .flex.flex-col.gap-4
    button(@click="addNewNodes" class="w-fit bg-blue-500 text-white px-4 py-2") Add New Node
    VNetworkGraph(class="graph" :nodes="nodes_ref" :edges="edges_ref" :layouts="layouts_ref" :configs="configs" :event-handlers="eventHandlers")

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
