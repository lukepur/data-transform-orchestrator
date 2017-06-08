<template>
<g>
  <rect :x="x" :y="y"
        rx="5" ry="5"
        :width="width"
        :height="height"
        class="node" />
  <text :x="x + width / 2"
        :y="y + height / 2"
        text-anchor="middle"
        dominant-baseline="middle">
    {{ label }}
  </text>
</g>
</template>

<script>
export default {
  name: 'graph-node',
  props: {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    label: String
  }
}
</script>

<style>
.node {
  stroke: #d3d3d3;
  shape-rendering: crispEdges;
  stroke-width: 2;
  fill: none;
}
</style>
