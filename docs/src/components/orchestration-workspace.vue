<template>
  <div class="orchestration-workspace"
    @drop="onDrop"
    @dragenter="cancel"
    @dragover="cancel">
    <svg :width="graphDimensions.width" :height="graphDimensions.height" :id="svg.workspaceId">
      <g v-for="n in graph.nodes()">
        <rect :x="nodeX(n)"
              :y="nodeY(n)"
              rx="5"
              ry="5"
              :width="node(n).width"
              :height="node(n).height"
              class="node" />
        <text :x="nodeX(n)+node(n).width/2"
              :y="nodeY(n)+node(n).height/2"
              text-anchor="middle"
              dominant-baseline="middle">
          {{ n }}
        </text>
      </g>
      <!-- Edges -->
      <g v-for="e in graph.edges()" class="edge">
        <path :d="pathForEdge(e)"/>
      </g>
    </svg>
    {{ graph }}
  </div>
</template>

<script>
import { find } from 'lodash';
import dagre from 'dagre';
import transforms from '../orchestrations/transforms';
import Orchestrator from 'data-transform-orchestrator';
import { config } from '../orchestrations/ema-for-field';

export default {
  name: 'orchestration-workspace',
  props: {
    nodeWidth: { type: Number, default: 100 },
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
      return x - (this.node(n).width / 2) + this.graphPadding;
    },
    nodeY (n) {
      const { y } = this.node(n);
      return y - (this.node(n).height / 2) + this.graphPadding;
    },
    pathForEdge (e) {
      const edge = this.edge(e);
      const firstPoint = edge.points[0];
      const padding = this.graphPadding;
      let path = `M${firstPoint.x + padding} ${firstPoint.y + padding}`;
      for (let i = 1; i < edge.points.length; i++) {
        const point = edge.points[i];
        path += ` L${point.x + padding} ${point.y + padding}`;
      }
      return path;
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
      links.forEach(link => {
        g.setEdge(link.source.nodeId, link.target.nodeId);
      });

      dagre.layout(g);
      return g;
    },
    graphDimensions () {
      return {
        width: this.graph.graph().width + (2 * this.graphPadding),
        height: this.graph.graph().height + (2 * this.graphPadding)
      };
    }
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

.node {
  stroke: #d3d3d3;
  shape-rendering: crispEdges;
  stroke-width: 2;
  fill: none;
}
.edge {
  stroke: #999;
  fill: none;
}
</style>
