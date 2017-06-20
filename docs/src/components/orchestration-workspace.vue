<template>
  <div class="orchestration-workspace"
    @drop="onDrop"
    @dragenter="cancel"
    @dragover="cancel">
    <PortGraph :graphConfig="graphConfig" :onPortConnection="handleConnection" :filterDropCandidates="filterDropCandidates" />
  </div>
</template>

<script>
import { find } from 'lodash';
import PortGraph from 'vue-port-graph';
import transforms from '../orchestrations/transforms';
import { applyNewPortConnection, isGraphAcyclic } from '../helpers/graph-helpers';
import Orchestrator from 'data-transform-orchestrator';
import { config } from '../orchestrations/ema-for-field';

export default {
  name: 'orchestration-workspace',
  props: {
    nodeWidth: { type: Number, default: 120 },
    nodeHeight: { type: Number, default: 50 },
    graphPadding: { type: Number, default: 20 }
  },
  data () {
    return {
      orchestrationConfig: { ...config }
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
    createUserInputNode (links) {
      return links.reduce((memo, link) => {
        if (link.source.nodeId === 'userInput') {
          memo.ports.push({
            id: link.source.path,
            type: 'source'
          });
        }
        return memo;
      }, { id: 'userInput', ports: [] });
    },
    handleConnection (con) {
      const result = applyNewPortConnection(this.graphConfig, con);
      console.log('result:', result);
      if (isGraphAcyclic(result)) {
        this.orchestrationConfig = {
          ...this.orchestrationConfig,
          links: convertGraphEdgesToLinks(result.edges)
        };
      }
    },
    filterDropCandidates (portBeingDragged, candidatePort) {
      debugger;
      console.log(this.orchestration);
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
      })).concat([this.createUserInputNode(links)]);

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
