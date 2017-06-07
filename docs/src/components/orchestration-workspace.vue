<template>
  <div class="orchestration-workspace"
    @drop="onDrop"
    @dragenter="cancel"
    @dragover="cancel">
    <pre>{{ JSON.stringify(orchestration.meta(), null, 2) }}</pre>
  </div>
</template>

<script>
import { find } from 'lodash';
import transforms from '../orchestrations/transforms';
import Orchestrator from 'data-transform-orchestrator';
import { config } from '../orchestrations/ema-for-field';

export default {
  name: 'orchestration-workspace',
  data () {
    return {
      orchestrationConfig: config
    };
  },
  methods: {
    onDrop (e) {
      const name = e.dataTransfer.getData('name');
      const transform = find(transforms, t => t.meta().name === name);
      if (transform) {
        this.orchestrationConfig.nodes.push({ ...transform, id: name });
      }
    },
    cancel (e) {
      e.preventDefault();
    }
  },
  computed: {
    orchestration () {
      return new Orchestrator(this.orchestrationConfig);
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
