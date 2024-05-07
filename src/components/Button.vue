<script setup lang="ts">
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
});
</script>

<template lang="pug">
button(:type="type" :class="class" class="w-full px-4 py-2 bg-blue-500 text-white rounded")
  span {{ text }}
</template>

<style lang="sass"></style>
