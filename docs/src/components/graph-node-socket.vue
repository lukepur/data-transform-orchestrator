<template>
  <circle :cx="x" :cy="y" r="10" class="socket" :class="socket.type">
  </circle>
</template>

<script>
import { find, last } from 'lodash';

export default {
  name: 'graph-node-socket',
  props: {
    parentNode: Object,
    socket: Object // { target: 'path', type: 'source|target'}
  },
  computed: {
    socketLink () {
      return find(this.parentNode.links, link => link.metaLink[this.socket.type].path === this.socket.target);
    },
    x () {
      if (this.socketLink) {
        return this.socket.type === 'target' ? last(this.socketLink.points).x : this.socketLink.points[0].x;
      }
      return 0;
    },
    y () {
      if (this.socketLink) {
        return this.socket.type === 'target' ? last(this.socketLink.points).y : this.socketLink.points[0].y;
      }
      return 0;
    }
  }
}
</script>

<style>
.socket {
  fill: #fff;
  stroke: #7a93a9;
  stroke-width: 3;
}
</style>
