<template>
  <div class="orchestration-workspace"
    @drop="onDrop"
    @dragenter="cancel"
    @dragover="cancel">
    <svg :width="svg.width" :height="svg.height" :id="workspaceId"></svg>
  </div>
</template>

<script>
import { find } from 'lodash';
import d3 from 'd3';
import transforms from '../orchestrations/transforms';
import Orchestrator from 'data-transform-orchestrator';
import { config } from '../orchestrations/ema-for-field';

export default {
  name: 'orchestration-workspace',
  data () {
    return {
      svg: {
        width: 800,
        height: 600,
        workspaceId: 'workspace'
      },
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
  },
  created () {
    const svg = d3.select('#'+this.svg.workspaceId);
    const { nodes, links } = this.orchestration.meta();

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(this.svg.width / 2, this.svg.height / 2));

    const link = svg.append('g')
      .attr('class', 'links')
    .selectAll('line')
    .data(links)
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
