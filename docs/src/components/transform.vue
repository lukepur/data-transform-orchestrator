<template>
  <div class="transform d-flex align-items-center justify-content-center"
       draggable="true"
       @dragstart="onDragStart">
    <span>{{ transform.meta().name }}</span>
  </div>
</template>

<script>
export default {
  name: 'transform',
  props: {
    transform: Object
  },
  methods: {
    onDragStart (e) {
      e.dataTransfer.setData('name', this.transform.meta().name);
    }
  }
};
</script>

<style scoped>
.transform {
  border: 1px solid #d3d3d3;
  border-radius: 3px;
  height: 3em;
  background-color: #ffffff;
}
</style>
