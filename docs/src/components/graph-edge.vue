<template>
  <g>
    <path :d="svgPath"/>
  </g>
</template>

<script>
export default {
  name: 'graph-edge',
  props: {
    edge: Object
  },
  computed: {
    svgPath () {
      const { edge } = this;
      const firstPoint = edge.points[0];
      let path = `M${firstPoint.x} ${firstPoint.y}`;
      for (let i = 1; i < edge.points.length; i++) {
        const point = edge.points[i];
        path += ` L${point.x} ${point.y}`;
      }
      return path;
    }
  }
}
</script>

<style>
.edge {
  stroke: #999;
  fill: none;
}
</style>
