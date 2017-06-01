<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-12">
        <div class="form-group row">
          <label for="orchestration-selector" class="col-3 col-form-label">Select Orchestration</label>
          <div class="col-9">
            <select class="form-control" id="orchestration-selector" v-model="selectedOrchestrationIndex">
              <option selected disabled value="-1">Select an item</option>
              <option v-for="(orchestration, index) in orchestrations" :value="index">{{ orchestration.meta().name }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <h4>Inputs</h4>
      </div>
      <div class="col-12">
        <div>
          <Component v-for="(link, index) in userInputs" :key="index"
            :is="componentEditorForConstraint(userInputConstraints[index])"
            :value="get(inputData, link.target.path)"
            :label="link.source.path"
            :update="e=>update(link.source.path, e)"/>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        INPUT: {{ inputData }}
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <h5>Node outputs</h5>
        <TreeView :data="output" />
      </div>
    </div>
  </div>
</template>

<script>
import { find, set, get } from 'lodash';
import TreeView from 'vue-json-tree-view/src/TreeView.vue';

import orchestrations from '../../orchestrations/orchestrations';
import JsonEditor from '../json-editor.vue';
import NumberEditor from '../number-editor.vue';
import StringEditor from '../string-editor.vue';
import MultilineEditor from '../multiline-editor.vue';

export default {
  name: 'orchestration-runner',
  data () {
    return {
      orchestrations,
      selectedOrchestrationIndex: null,
      inputData: {}
    };
  },
  computed: {
    selectedOrchestration () {
      return this.orchestrations[this.selectedOrchestrationIndex];
    },
    userInputs () {
      if (!this.selectedOrchestration) return null;
      return this.selectedOrchestration.meta().links
        .filter(link => link.source.nodeId === 'userInput');
    },
    userInputConstraints () {
      if (!this.userInputs) return null;
      const { nodes } = this.selectedOrchestration.meta();
      return this.userInputs.map(link => {
        const { nodeId, path } = link.target;
        return getConstraintByPath(
          path,
          find(nodes, { id: nodeId }).meta().inputConstraints
        );
      });
    },
    output () {
      if (!this.selectedOrchestration) return null;
      try {
        return this.selectedOrchestration.run(this.inputData);
      } catch (err) {
        return null;
      }
    }
  },
  methods: {
    get,
    update (path, value) {
      set(this.inputData, path, value);
      this.inputData = { ...this.inputData };
    },
    componentEditorForConstraint (constraint) {
      const { type } = constraint;
      if (type === 'string') {
        if (constraint.opts && constraint.opts.multiline) {
          return 'MultilineEditor';
        }
        return 'StringEditor';
      }
      if (type === 'number') {
        return 'NumberEditor';
      }
      return 'JsonEditor';
    }
  },
  components: {
    JsonEditor,
    NumberEditor,
    StringEditor,
    MultilineEditor,
    TreeView
  }
}

function getConstraintByPath (path, meta) {
  const pathArr = path.split('.');
  let m = meta;
  pathArr.forEach(p => {
    m = find(m, {id: p});
    if (!m) {
      m = find(m.children, {id: p});
    }
  });
  return m;
}
</script>
