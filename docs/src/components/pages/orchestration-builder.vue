<template>
  <div class="container">
    <div class="row">
      <h1 class="col-12">Orchestration Builder</h1>
    </div>
    <div class="row">
      <div class="col-3">
        <h5>Transforms</h5>
        <TransformCategory
          v-for="(ts, name) in transformCategories"
          :categoryName="name"
          :transforms="ts"
          :key="name" />
      </div>
      <div class="col-9">
        <h5>Workspace</h5>
        <OrchestrationWorkspace />
      </div>
    </div>
  </div>
</template>

<script>
import transforms from '../../orchestrations/transforms';
import TransformCategory from '../transform-category.vue';
import OrchestrationWorkspace from '../orchestration-workspace.vue';

export default {
  name: 'orchestration-builder',
  data () {
    return {
      transforms
    }
  },
  computed: {
    transformCategories () {
      return this.transforms.reduce((memo, t) => {
        const { categories } = t.meta();
        categories.forEach(category => {
          memo[category] = memo[category] || [];
          memo[category].push(t);
        });
        return memo;
      }, {});
    }
  },
  components: {
    TransformCategory,
    OrchestrationWorkspace
  }
}
</script>
