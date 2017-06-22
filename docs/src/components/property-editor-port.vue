<template>
<div>
  <div>
    <span>Editing Port: <strong>{{entity.data.nodeId}}:{{entity.data.portId}}</strong></span>
  </div>
  <div v-if="entity.data.isEditable" class="form-group">
    <input type="text" v-model="localData.portId" class="form-control" />
  </div>
  <div>
    <button class="btn" @click="onSaveEntity({type: 'port', data: localData})">Save</button>
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
    },
    onSaveEntity: {
      type: Function,
      default: () => {}
    }
  },

  data () {
    return {
      localData: { ...this.entity.data }
    };
  },

  methods: {
  },

  watch: {
    entity (newValue) {
      this.localData = { ...newValue.data };
    }
  }
}
</script>
