<template>
  <circle :cx="socket.point.x" :cy="socket.point.y" :r="width" class="socket" :class="socket.type">
  </circle>
</template>

<script>
export default {
  name: 'graph-node-socket',
  props: {
    parentNode: Object,
    socket: Object, // { taget: 'path', type: 'source|target', point: {x, y}}
    width: Number
  },
  computed: {}
}
</script>

<style>
.socket {
  fill: #fff;
  stroke: #7a93a9;
  stroke-width: 3;
}
</style>
