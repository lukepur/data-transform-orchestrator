<template>
  <div class="orchestration-workspace"
    @drop="onDrop"
    @dragenter="cancel"
    @dragover="cancel">
    <PortGraph
      :graphConfig="graphConfig"
      :onConnection="handleConnection"
      :filterDropCandidates="filterDropCandidates"
      :onEntityClick="handleEntityClick" />
  </div>
</template>

<script>
import { find, chain } from 'lodash';
import PortGraph from 'vue-port-graph';
import transforms from '../orchestrations/transforms';
import { applyNewConnection, isGraphAcyclic } from '../helpers/graph-helpers';
import Orchestrator, { consts } from 'data-transform-orchestrator';
import { config } from '../orchestrations/ema-for-field';

const { SYSTEM_IN } = consts.default;

export default {
  name: 'orchestration-workspace',
  props: {
    nodeWidth: { type: Number, default: 120 },
    nodeHeight: { type: Number, default: 50 },
    graphPadding: { type: Number, default: 20 },
    onClickEntity: { type: Function, default: () => {} }
  },

  data () {
    return {
      orchestrationConfig: { ...config },
      systemInputNode: createSystemInputNodeFromOrchestrationConfig({ ...config })
    };
  },

  methods: {
    onDrop (e) {
      const name = e.dataTransfer.getData('name');
      const transform = find(transforms, t => t.meta().name === name);
      if (transform) {
        this.orchestrationConfig.nodes.push({ ...transform, id: name });
      }
    },

    cancel (e) {
      e.preventDefault();
    },

    handleConnection (con) {
      const result = applyNewConnection(this.graphConfig, con);
      if (isGraphAcyclic(result)) {
        this.orchestrationConfig = {
          ...this.orchestrationConfig,
          links: convertGraphEdgesToLinks(result.edges)
        };
      }
    },

    filterDropCandidates (portBeingDragged, candidatePort) {
      return true;
    },

    handleEntityClick (entity) {
      if (entity.type === 'port') {
        const { nodeId, portId } = entity.data;
        return this.onClickEntity({
          type: entity.type,
          data: {
            ...entity.data,
            ...getConfigPort(this.graphConfig, nodeId, portId)
          }
        });
      }
      return this.onClickEntity(entity);
    },

    handleEntitySave (entity) {
      console.log('received entity to save (workspace):', entity);
    }
  },

  computed: {
    orchestration () {
      return new Orchestrator(this.orchestrationConfig);
    },

    graphConfig () {
      const { nodes, links } = this.orchestration.meta();
      if (!nodes || !links) return {};
      const nodeConfig = nodes.map(node => ({
        id: node.id,
        ports: node.meta().inputConstraints.map(c => ({ id: c.id, type: 'input' }))
          .concat(node.meta().outputConstraints.map(c => ({ id: c.id, type: 'output' })))
      })).concat([this.systemInputNode]);

      return {
        nodes: nodeConfig,
        edges: links.map(l => ({
          source: { nodeId: l.source.nodeId, portId: l.source.path },
          target: { nodeId: l.target.nodeId, portId: l.target.path }
        })),
        options: {
          dagre: {}
        }
      };
    }
  },

  components: {
    PortGraph
  }
}

function createSystemInputNodeFromOrchestrationConfig (config = {}) {
  const node = { id: SYSTEM_IN, ports: [], canCreateOutputPorts: true };
  const { links } = config;
  if (links) {
    links.forEach(l => {
      if (l.source.nodeId === SYSTEM_IN) {
        node.ports.push({
          id: l.source.path,
          type: 'output',
          isEditable: true
        });
      }
    })
  }
  return node;
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

<style>
.orchestration-workspace {
  width: 100%;
  min-height: 600px;
  border: solid 1px #d3d3d3;
  padding: 1em;
}

.graph {
  display: block;
  margin: 0 auto;
}
</style>
