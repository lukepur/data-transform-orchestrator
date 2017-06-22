<template>
<div>
  <h4>Node editor</h4>
</div>
</template>

<script>
export default {
  name: 'property-editor-node',
  props: {
    entity: {
      type: Object,
      default: () => ({ type: 'node', data: {} })
    }
  }
}
</script>
