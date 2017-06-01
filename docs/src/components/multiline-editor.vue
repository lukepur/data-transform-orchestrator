<template>
  <div class="control-group">
    <label>{{ label }}</label>
    <textarea :value="value" @change="e=>update(e.target.value)" class="form-control"></textarea>
  </div>
</template>

<script>
export default {
  name: 'multiline-editor',
  props: {
    label: String,
    value: String,
    update: Function
  }
}
</script>

