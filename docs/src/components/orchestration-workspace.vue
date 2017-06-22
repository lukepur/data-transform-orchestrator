<template>
  <div class="orchestration-workspace"
    @drop="onDrop"
    @dragenter="cancel"
    @dragover="cancel">
    <PortGraph
      :graphConfig="graphConfig"
      :onConnection="(con) => onConnection(graphConfig, con)"
      :onEntityClick="(entity) => onClickEntity(graphConfig, entity)" />
  </div>
</template>

<script>
import PortGraph from 'vue-port-graph';
import Orchestrator, { consts } from 'data-transform-orchestrator';

const { SYSTEM_IN } = consts.default;

export default {
  name: 'orchestration-workspace',
  props: {
    orchestrationConfig: { type: Object, default: () => ({}) },
    onDrop: { type: Function, default: () => {} },
    onClickEntity: { type: Function, default: () => {} },
    onConnection: { type: Function, default: () => {} },

    nodeWidth: { type: Number, default: 120 },
    nodeHeight: { type: Number, default: 50 },
    graphPadding: { type: Number, default: 20 }
  },

  data () {
    return {
      systemInputNode: createSystemInputNodeFromOrchestrationConfig({ ...this.orchestrationConfig })
    };
  },

  methods: {
    cancel (e) {
      e.preventDefault();
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

  watch: {
    orchestrationConfig (newValue) {
      this.systemInputNode = createSystemInputNodeFromOrchestrationConfig({ ...newValue });
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
