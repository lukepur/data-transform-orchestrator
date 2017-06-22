<template>
  <div class="container">
    <div class="row">
      <h1 class="col-12">Orchestration Builder</h1>
    </div>
    <div class="row">
      <div class="col-3">
        <h5>Property Editor</h5>
        <PropertyEditor :entity="selectedEntity" :onSaveEntity="handleEntitySave"/>
        <h5>Transforms</h5>
        <TransformCategory
          v-for="(ts, name) in transformCategories"
          :categoryName="name"
          :transforms="ts"
          :key="name" />
      </div>
      <div class="col-9">
        <h5>Workspace</h5>
        <OrchestrationWorkspace
          :onClickEntity="handleEntityClick"
          :orchestrationConfig="orchestrationConfig"
          :onDrop="handleWorkspaceDrop"
          :onConnection="handleEdgeConnection" />
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep, find, chain } from 'lodash';

import { config } from '../../orchestrations/ema-for-field';
import transforms from '../../orchestrations/transforms';
import TransformCategory from '../transform-category.vue';
import OrchestrationWorkspace from '../orchestration-workspace.vue';
import PropertyEditor from '../property-editor.vue';
import { applyNewConnection, isGraphAcyclic } from '../../helpers/graph-helpers';

export default {
  name: 'orchestration-builder',

  data () {
    return {
      transforms,
      selectedEntity: null,
      orchestrationConfig: { ...config }
    };
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
    // workspace handlers
    handleWorkspaceDrop (e) {
      const name = e.dataTransfer.getData('name');
      const transform = find(transforms, t => t.meta().name === name);
      if (transform) {
        this.orchestrationConfig.nodes.push({ ...transform, id: name });
      }
    },

    handleEdgeConnection (targetGraph, con) {
      const result = applyNewConnection(targetGraph, con);
      if (isGraphAcyclic(result)) {
        this.orchestrationConfig = {
          ...this.orchestrationConfig,
          links: convertGraphEdgesToLinks(result.edges)
        };
      }
    },

    handleEntityClick (targetGraph, entity) {
      if (entity.type === 'port') {
        const { nodeId, portId } = entity.data;
        this.selectedEntity = {
          type: entity.type,
          data: {
            ...entity.data,
            ...getConfigPort(targetGraph, nodeId, portId)
          }
        };
      } else {
        this.selectedEntity = cloneDeep(entity);
      }
    },

    // property editor handlers
    handleEntitySave (entity) {
      console.log('received entity to save (workspace):', entity);
    }
  },

  components: {
    TransformCategory,
    OrchestrationWorkspace,
    PropertyEditor
  }
}

function convertGraphEdgesToLinks (edges = []) {
  return edges.map(e => ({
    source: {
      nodeId: e.source.nodeId,
      path: e.source.portId
    },
    target: {
      nodeId: e.target.nodeId,
      path: e.target.portId
    }
  }));
}

function getConfigPort (config, nodeId, portId) {
  return chain(config.nodes)
    .find({ id: nodeId })
    .get('ports')
    .find({ id: portId })
    .value()
}

</script>
