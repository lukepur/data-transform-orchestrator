<template>
  <div class="orchestration-workspace"
    @drop="onDrop"
    @dragenter="cancel"
    @dragover="cancel">
    <svg :width="graphDimensions.width" :height="graphDimensions.height" :id="svg.workspaceId" class="graph">
      <g :transform="'translate('+this.graphPadding+','+this.graphPadding+')'">
        <!-- Edges -->
        <g v-for="e in graphEdges" class="edge">
          <GraphEdge :edge="e" />
        </g>
        <!-- Nodes -->
        <g v-for="n in graphNodes">
          <GraphNode :node="n" />
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import { find } from 'lodash';
import dagre from 'dagre';
import transforms from '../orchestrations/transforms';
import Orchestrator from 'data-transform-orchestrator';
import { config } from '../orchestrations/ema-for-field';
import GraphNode from './graph-node.vue';
import GraphEdge from './graph-edge.vue';

export default {
  name: 'orchestration-workspace',
  props: {
    nodeWidth: { type: Number, default: 120 },
    nodeHeight: { type: Number, default: 50 },
    graphPadding: { type: Number, default: 20 }
  },
  data () {
    return {
      svg: {
        width: 800,
        height: 600,
        workspaceId: 'workspace'
      },
      orchestrationConfig: config
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
    node (n) {
      return this.graph.node(n);
    },
    edge (e) {
      return this.graph.edge(e);
    },
    nodeX (n) {
      const { x } = this.node(n);
      // return x - (this.node(n).width / 2) + this.graphPadding;
      return x - (this.node(n).width / 2);
    },
    nodeY (n) {
      const { y } = this.node(n);
      // return y - (this.node(n).height / 2) + this.graphPadding;
      return y - (this.node(n).height / 2);
    },
    padEdge (edge) {
      return {
        ...edge,
        points: edge.points.map(p => ({ x: p.x + this.graphPadding, y: p.y + this.graphPadding }))
      };
    },
    getLinksForNode (n) {
      const { links: metaLinks } = this.orchestration.meta();
      // const result = links.filter(link => link.target.nodeId === n || link.source.nodeId === n);
      const result = this.graph.nodeEdges(n).map(e => ({
        ...this.edge(e),
        metaLink: find(metaLinks, link => link.target.nodeId === e.w && link.source.nodeId === e.v)
      }));
      return result;
    },
    getMetaForNode (n) {
      const meta = this.orchestration.meta();
      const targetNode = find(meta.nodes, { id: n });
      return targetNode ? targetNode.meta() : null;
    }
  },
  computed: {
    orchestration () {
      return new Orchestrator(this.orchestrationConfig);
    },
    graph () {
      const { nodes, links } = this.orchestration.meta();
      const { nodeWidth, nodeHeight } = this;
      const g = new dagre.graphlib.Graph();
      g.setGraph({});
      g.setDefaultEdgeLabel(() => ({}));

      nodes.forEach(node => {
        g.setNode(node.id, {
          label: node.id,
          width: nodeWidth,
          height: nodeHeight
        });
      });
      // add userInput node
      g.setNode('userInput', {
        label: 'userInput',
        width: nodeWidth,
        height: nodeHeight
      });
      links.forEach((link, index) => {
        g.setEdge(link.source.nodeId, link.target.nodeId, { label: index });
      });

      dagre.layout(g, {
        // marginx: this.graphPadding,
        // marginy: this.graphPadding
        marginx: 100,
        marginy: 100
      });
      return g;
    },
    graphNodes () {
      return this.graph.nodes().map(n => ({
        x: this.nodeX(n),
        y: this.nodeY(n),
        width: this.node(n).width,
        height: this.node(n).height,
        label: n,
        links: this.getLinksForNode(n),
        meta: this.getMetaForNode(n)
      }));
    },
    graphEdges () {
      return this.graph.edges().map(e => ({
        ...this.edge(e),
        sourceNode: find(this.graphNodes, { label: e.v }),
        targetNode: find(this.graphNodes, { label: e.w })
      }));
    },
    graphDimensions () {
      return {
        width: this.graph.graph().width + (2 * this.graphPadding),
        height: this.graph.graph().height + (2 * this.graphPadding)
      };
    }
  },
  components: {
    GraphNode,
    GraphEdge
  }
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
