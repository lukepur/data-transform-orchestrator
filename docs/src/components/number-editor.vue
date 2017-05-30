<template>
  <div class="control-group">
    <label>{{ label }}</label>
    <input type="number" :value="value" @change="e=>update(e.target.value)" />
  </div>
</template>

<script>
export default {
  name: 'number-editor',
  props: {
    label: String,
    value: String,
    update: Function
  }
}
</script>
