<template>
<g>
  <rect :x="node.x" :y="node.y"
        rx="5" ry="5"
        :width="node.width"
        :height="node.height"
        class="node" />
  <text :x="node.x + node.width / 2"
        :y="node.y + node.height / 2"
        text-anchor="middle"
        dominant-baseline="middle">
    {{ node.label }}
  </text>
  <GraphNodeSocket v-for="(link, index) in node.links" :key="index" :parentNode="node" :socket="socketForLink(link.metaLink)"/>
</g>
</template>

<script>
import GraphNodeSocket from './graph-node-socket.vue';

export default {
  name: 'graph-node',
  props: {
    node: Object
  },
  methods: {
    socketForLink (link) {
      const type = (link.source.nodeId === this.node.label ? 'source' : 'target');
      return {
        target: link[type].path,
        type
      };
    }
  },
  components: {
    GraphNodeSocket
  }
}
</script>

<style>
.node {
  stroke: #7a93a9;
  stroke-width: 4;
  fill: none;
}
</style>
