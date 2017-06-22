<template>
<div>
  <div>
    <span>Editing Port: <strong>{{entity.data.nodeId}}:{{entity.data.portId}}</strong></span>
  </div>
  <div>
    <span>Editable: {{ entity.data.isEditable }}</span>
  </div>
</div>
</template>

<script>
export default {
  name: 'property-editor-port',
  props: {
    entity: {
      type: Object,
      default: () => ({ type: 'port', data: {} })
    }
  }
}
</script>
