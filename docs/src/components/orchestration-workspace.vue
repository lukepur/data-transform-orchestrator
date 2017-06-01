<template>
  <div class="orchestration-workspace"
    @drop="onDrop"
    @dragenter="cancel"
    @dragover="cancel">
    <pre>{{ JSON.stringify(orchestration, null, 2) }}</pre>
  </div>
</template>

<script>
import { find } from 'lodash';
import transforms from '../orchestrations/transforms';

export default {
  name: 'orchestration-workspace',
  data () {
    return {
      orchestration: {
        nodes: [],
        links: [],
        meta: {}
      }
    };
  },
  methods: {
    onDrop (e) {
      const name = e.dataTransfer.getData('name');
      const transform = find(transforms, t => t.meta().name === name);
      if (transform) {
        this.orchestration.nodes.push({ ...transform, id: name });
      }
    },
    cancel (e) {
      e.preventDefault();
    }
  }
}
</script>

<style>
.orchestration-workspace {
  width: 100%;
  min-height: 600px;
  border: solid 1px #d3d3d3;
  padding: 1em;
}
</style>
