<template>
  <div class="control-group">
    <label>{{ label }}</label>
    <input type="text" :value="value" @change="e=>update(e.target.value)" class="form-control"/>
  </div>
</template>

<script>
export default {
  name: 'string-editor',
  props: {
    label: String,
    value: String,
    update: Function
  }
}
</script>
