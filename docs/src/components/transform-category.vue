<template>
  <div>
    <div class="category-title">
      <div class="transforms-container row">
        <button @click="toggleExpanded" class="btn btn-primary col-12 category-expander">{{ categoryName }}</button>
      </div>
    </div>
    <div class="transforms-container row" :class="expandedClass">
      <div class="transform-container col-6"
          v-for="transform in transforms">
        <div class="transform d-flex align-items-center justify-content-center">
          <span>{{ transform.meta().name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'transform-category',
  props: {
    categoryName: String,
    transforms: Array
  },
  data () {
    return {
      expandedClass: 'collapsed'
    }
  },
  methods: {
    toggleExpanded () {
      this.expandedClass = (this.expandedClass === '' ? 'collapsed' : '');
    }
  }
};
</script>

<style scoped>
.transforms-container {
  margin-bottom: 0.25em;
}

.transform {
  border: 1px solid #d3d3d3;
  border-radius: 3px;
  height: 3em;
}

.collapsed {
  display: none;
}
</style>
