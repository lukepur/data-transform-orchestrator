'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var toposort = require('toposort');

var _require = require('lodash'),
    find = _require.find,
    assign = _require.assign,
    set = _require.set;

var _require2 = require('./consts'),
    SYSTEM_IN = _require2.SYSTEM_IN;

function Orchestrator(config) {
  var nodes = config.nodes,
      links = config.links,
      meta = config.meta;


  this.run = function (systemInput) {
    var graph = buildDependencyGraph(links);
    var inputCache = {};
    var resultCache = {};

    // ensure all userInputs are available
    var systemInputLinks = links.filter(function (link) {
      return link.source.nodeId === SYSTEM_IN;
    });
    var unenteredInputs = systemInputLinks.filter(function (link) {
      return systemInput[link.source.path] === undefined;
    });

    if (unenteredInputs.length > 0) {
      throw Error('Unentered inputs: ' + unenteredInputs.map(function (link) {
        return link.source.path;
      }).join(','));
    }

    // put systemInput into target inputs
    systemInputLinks.forEach(function (link) {
      set(inputCache, [link.target.nodeId, link.target.path], systemInput[link.source.path]);
    });

    // good to run...

    var _loop = function _loop(i) {
      // graph.forEach(nodeId => {
      var nodeId = graph[i];
      var node = find(nodes, { id: nodeId });

      if (!node) return 'continue'; // user node

      // collect inputs to run node
      var sourceLinks = links.filter(function (link) {
        return link.target.nodeId === nodeId;
      });
      var nodeInput = inputCache[nodeId];

      // calculate result
      var nodeResult = void 0;
      try {
        nodeResult = node.run(nodeInput);
      } catch (e) {}
      // TODO


      // Check if this node has input errors
      if (nodeResult && nodeResult.inputErrors) {
        resultCache.inputErrors = {
          nodeId: nodeId,
          errors: nodeResult.inputErrors
        };
        return {
          v: resultCache
        }; // don't process any more nodes
      }

      // Check if this node has output errors
      if (nodeResult && nodeResult.outputErrors) {
        resultCache.outputErrors = {
          nodeId: nodeId,
          errors: nodeResult.outputErrors
        };
        return {
          v: resultCache
        }; // don't process any more nodes
      }
      // add result to input cache for next iteration
      links.filter(function (link) {
        return link.source.nodeId === nodeId;
      }).forEach(function (link) {
        set(inputCache, [link.target.nodeId, link.target.path], nodeResult);
      });

      // add result to result cache
      resultCache[nodeId] = {
        output: nodeResult
      };
    };

    for (var i = 0; i < graph.length; i++) {
      var _ret = _loop(i);

      switch (_ret) {
        case 'continue':
          continue;

        default:
          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
    };

    return resultCache;
  };

  this.meta = function () {
    return assign({}, meta, {
      nodes: nodes,
      links: links
    });
  };
};

module.exports = Orchestrator;
module.exports.consts = require('./consts');

function buildDependencyGraph(links) {
  var depGraph = [];

  links.forEach(function (link) {
    depGraph.push([link.source.nodeId, link.target.nodeId]);
  });

  return toposort(depGraph);
}

// test:
// const testConfig = require('../test/test-config');
// const orchestrator = new Orchestrator(testConfig);
// console.log('orchestrator meta:', orchestrator.meta());
// console.log('output:');
// const result = orchestrator.run({
//   priceArray: [{c: 1}, {c: 2}, {c: 3}, {c: 4}, {c: 4}, {c: 4}, {c: 4}, {c: 6}, {c: 3}, {c: 9},{c: 20}],
//   priceField: 'c',
//   periods: 1.5
// });
// console.log(result);