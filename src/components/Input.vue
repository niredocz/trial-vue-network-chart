<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    default: "input",
  },
  type: {
    type: String,
    default: "text",
    validator: function (value: string) {
      return (
        ["text", "number", "email", "password", "tel"].indexOf(value) !== -1
      );
    },
  },
  placeholder: {
    type: String,
    default: null,
  },
  modelValue: {
    type: String,
    Number,
    default: null,
  },
  error: {
    type: Boolean,
    default: false,
  },
  error_message: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template lang="pug">
.flex.flex-col.items-start
  input(
    :id="id" 
    :data-testid="id" 
    :class="[error ? 'border-red-500' : 'border-neutral-500', 'border px-4 py-3 w-full rounded']"
    :placeholder="placeholder"
    :value="modelValue"
    :type="type"
    :autocomplete="type === 'password' ? 'on' : undefined"
    @input="(event) => $emit('update:modelValue', event.target.value)"
  )
  p(v-if="error" class="text-xs text-red-500") {{ error_message }}
</template>

<style lang="sass"></style>
