<template>
  <div class="orchestration-workspace"
    @drop="onDrop"
    @dragenter="cancel"
    @dragover="cancel">
    <svg :width="svg.width" :height="svg.height" :id="svg.workspaceId"></svg>
  </div>
</template>

<script>
import { find } from 'lodash';
import transforms from '../orchestrations/transforms';
import Orchestrator from 'data-transform-orchestrator';
import { config } from '../orchestrations/ema-for-field';

const d3 = require('d3');

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
  mounted () {
    const svg = d3.select('#' + this.svg.workspaceId);
    const { nodes, links } = this.orchestration.meta();
    const { width, height } = this.svg;

    // flatten links for d3 force()
    const d3Links = links.map(link => ({
      source: link.source.nodeId,
      sourcePath: link.source.path,
      target: link.target.nodeId,
      targetPath: link.target.path
    }));
    const d3Nodes = [...nodes];
    d3Nodes.push({id: 'userInput'});

    const simulation = d3.forceSimulation()
          .force('link', d3.forceLink().id(d => d.id))
          .force('charge', d3.forceManyBody()(-20))
          .force('center', d3.forceCenter(width / 2, height / 2));

    const n = nodes.length;

    simulation.nodes(d3Nodes).on('tick', ticked);
    simulation.force('link').links(d3Links);

    d3Nodes.forEach((d, i) => {
      d.x = d.y = width / n * i;
    });

    const link = svg.selectAll('.link')
          .data(d3Links)
      .enter().append('line')
        .attr('class', 'link')
        .style('stroke-width', d => Math.sqrt(d.value));

    const node = svg.selectAll('.node')
          .data(d3Nodes)
      .enter().append('circle')
        .attr('class', 'node')
        .attr('r', 4.5)
        .attr('title', d => d.id)
        .style('fill', '#ff0000');

    function ticked () {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
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

.link {
  stroke: #aaa;
}
</style>
