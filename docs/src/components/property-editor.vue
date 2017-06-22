<template>
<div>
  <h6>Prop editor</h6>
  <component :is="editorType" :entity="entity" />
</div>
</template>

<script>
import NodeEditor from './property-editor-node.vue';
import PortEditor from './property-editor-port.vue';

export default {
  name: 'property-editor',
  props: {
    entity: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    editorType () {
      if (this.entity) {
        return this.entity.type === 'node' ? 'NodeEditor' : 'PortEditor';
      }
      return null;
    }
  },

  components: {
    NodeEditor,
    PortEditor
  }
};
</script>
