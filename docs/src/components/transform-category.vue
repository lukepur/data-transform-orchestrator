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
        <Transform :transform="transform" />
      </div>
    </div>
  </div>
</template>

<script>
import Transform from './transform.vue'

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
  },
  components: {
    Transform
  }
};
</script>

<style scoped>
.transforms-container {
  margin-bottom: 0.25em;
}

.collapsed {
  display: none;
}
</style>
