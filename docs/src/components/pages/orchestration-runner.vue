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
        <ul>
          <li v-for="(link, index) in userInputs">
          <Component
            :is="componentEditorForType(userInputConstraints[index].type)"
            :value="get(inputData, link.target.path)"
            :label="link.source.path"
            :update="e=>update(link.source.path, e)"/>
          </li>
        </ul>
      </div>
      <div class="col-12">
        INPUT: {{ inputData }}
      </div>
    </div>
  </div>
</template>

<script>
import { find, set, get } from 'lodash';

import orchestrations from '../../orchestrations/orchestrations';
import JsonEditor from '../json-editor.vue';
import NumberEditor from '../number-editor.vue';
import StringEditor from '../string-editor.vue';

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
    }
  },
  methods: {
    get,
    update (path, value) {
      set(this.inputData, path, value);
      this.inputData = { ...this.inputData };
    },
    componentEditorForType (type) {
      if (type === 'string') {
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
    StringEditor
  }
}

function getConstraintByPath (path, meta) {
  console.log(path, meta);
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
