<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "button",
    validator: function (value: string) {
      return ["button", "submit", "reset"].indexOf(value) !== -1;
    },
  },
  class: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const class_ref = computed(() => {
  if (!props.disabled) {
    return props.class
  } else {
    return props.class + '!bg-blue-300'
  }
})
</script>

<template lang="pug">
button(:type="type" :class="class_ref" class="w-full px-4 py-2 bg-blue-500 text-white rounded" :disabled="props.disabled")
  span {{ text }}
  slot
</template>

<style lang="sass"></style>
