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
  <GraphNodeSocket v-for="(socket, index) in sockets" :key="index" :parentNode="node" :socket="socket" :width="socketWidth"/>
</g>
</template>

<script>
import { find, last, sortBy } from 'lodash';

import GraphNodeSocket from './graph-node-socket.vue';

export default {
  name: 'graph-node',

  props: {
    node: Object,
    socketWidth: {
      type: Number,
      default: 8
    }
  },

  methods: {
    socketForLink (link) {
      const { metaLink } = link;
      const type = (metaLink.source.nodeId === this.node.label ? 'source' : 'target');
      const point = (type === 'source' ? link.points[0] : last(link.points));
      return {
        target: metaLink[type].path,
        type,
        point
      };
    },
    addPointsForUnconnectedSockets (sockets) {
      let unconnectedSocksCount = sockets.filter(socket => !socket.point).length;
      while (unconnectedSocksCount > 0) {
        const targetSocket = find(sockets, socket => !socket.point);
        const existingSocks = sortBy(
          sockets.filter(socket => socket.type === targetSocket.type && socket.point),
          socket => socket.point.x);
        let partitions = [{xStart: this.node.x, width: this.node.width}];
        existingSocks.forEach((s, i) => {
          // split the partition at s's index
          const replacedPart = partitions[i];
          const left = {
            xStart: replacedPart.xStart,
            width: (replacedPart.width - this.socketWidth) / 2
          };
          const right = {
            xStart: left.width + this.socketWidth,
            width: left.width
          };
          partitions.splice(0, 1, left, right);
        });
        partitions = sortBy(partitions, part => part.xStart).reverse();
        // put the target socket in the middle of the largest part
        targetSocket.point = {
          x: partitions[0].xStart + (partitions[0].width / 2),
          y: targetSocket.type === 'target' ? this.node.y : this.node.y + this.node.height
        };
        unconnectedSocksCount--;
      }
    }
  },

  computed: {
    sockets () {
      // merge meta constraints and links
      const { node } = this;
      const { meta } = node;
      const socks = node.links.map(l => this.socketForLink(l));
      if (meta) {
        meta.inputConstraints.forEach(constraint => {
          if (!find(socks, { type: 'target', target: constraint.id })) {
            // unlinked socket - add to array
            socks.push({
              type: 'target',
              target: constraint.id
            });
          }
        });
        meta.outputConstraints.forEach(constraint => {
          if (!find(socks, { type: 'source', target: constraint.id })) {
            socks.push({
              type: 'source',
              target: constraint.id
            });
          }
        });
      }
      // Add empty points
      this.addPointsForUnconnectedSockets(socks);
      return socks;
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
