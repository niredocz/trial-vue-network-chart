<script setup lang="ts">
import { ref } from 'vue'

const menu = [
  {
    name: "Default",
    path: "/"
  },
  {
    name: "Collapsible",
    path: "/collapsible"
  },
  {
    name: "D3 Force",
    path: "/d3-force"
  },
  {
    name: "Vis JS",
    path: "/visjs"
  }
]

const menu_ref = ref(menu)
</script>

<template lang="pug">
.p-4
  .flex.items-center.justify-between.mb-4.border-b.daborder-black.pb-4
    .text-3xl Logo

    .flex.gap-4
      div(v-for="item in menu_ref" :key="item.name")
        routerLink(class="router-link" :to="item.path") {{ item.name }}

  slot
</template>

<style lang="sass" scoped>
.router-link
  @apply hover:underline
  
</style>