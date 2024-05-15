<script setup lang='ts'>
import Input from "./Input.vue";

const props = defineProps({
  ref: {
    type: String,
    required: true
  },
  class: {
    type: String
  }
})

const convert = ["KTP", "KK", "BPJS", "NPWP", "Phone Number"];
</script>

<template lang='pug'>
div(:ref="props.ref" :class="props.class")
  Input
  .context-menu--options 
    .context-menu--options--item(v-for="(item, key) in convert" :key="key" class="hover:text-[#202428] text-[#9FB3C8]")
      span.font-bold Passport 
      span.font-normal to 
      span.font-bold {{ item }}
  .context-menu--more More
</template>

<!-- <style lang='sass'>
.context-menu
  @apply w-[225px] bg-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.15)] rounded p-3 fixed invisible
  &--options
    @apply mt-3 flex flex-col gap-2
    &--item
      @apply text-sm cursor-pointer
  &--more
    @apply mt-4 text-sm font-bold text-[#56C9CA] cursor-pointer
</style> -->