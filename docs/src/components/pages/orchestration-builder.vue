<template>
  <div class="container">
    <div class="row">
      <h1 class="col-12">Orchestration Builder</h1>
    </div>
    <div class="row">
      <div class="col-3">
        <h5>Property Editor</h5>
        <PropertyEditor :entity="selectedEntity" :onSaveEntity="handleSaveEntity"/>
        <h5>Transforms</h5>
        <TransformCategory
          v-for="(ts, name) in transformCategories"
          :categoryName="name"
          :transforms="ts"
          :key="name" />
      </div>
      <div class="col-9">
        <h5>Workspace</h5>
        <OrchestrationWorkspace :onClickEntity="handleClickEntity" />
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';

import transforms from '../../orchestrations/transforms';
import TransformCategory from '../transform-category.vue';
import OrchestrationWorkspace from '../orchestration-workspace.vue';
import PropertyEditor from '../property-editor.vue';

export default {
  name: 'orchestration-builder',
  data () {
    return {
      transforms,
      selectedEntity: null
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
  methods: {
    handleClickEntity (entity) {
      this.selectedEntity = cloneDeep(entity);
    },

    handleSaveEntity (entity) {
      console.log('received saveEntity', entity);
    }
  },
  components: {
    TransformCategory,
    OrchestrationWorkspace,
    PropertyEditor
  }
}
</script>
