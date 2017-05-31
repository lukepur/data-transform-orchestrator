'use strict';

var toposort = require('toposort');

var _require = require('lodash'),
    find = _require.find,
    assign = _require.assign,
    set = _require.set;

function Orchestrator(config) {
  var nodes = config.nodes,
      links = config.links,
      meta = config.meta;


  this.run = function (userInput) {
    var graph = buildDependencyGraph(links);
    var resultCache = {
      userInput: userInput
    };

    // ensure all userInputs are available
    var userInputLinks = links.filter(function (link) {
      return link.source.nodeId === 'userInput';
    });

    var unenteredInputs = userInputLinks.filter(function (link) {
      return userInput[link.source.path] === undefined;
    });

    if (unenteredInputs.length > 0) {
      throw Error('Enentered inputs: ' + unenteredInputs.map(function (link) {
        return link.source.path;
      }).join(','));
    }

    // put userInputs into target inputs
    userInputLinks.forEach(function (link) {
      set(resultCache, [link.target.nodeId, link.target.path], userInput[link.source.path]);
    });

    // good to run...
    graph.forEach(function (nodeId) {
      var node = find(nodes, { id: nodeId });

      if (!node) return; // user node

      // collect inputs to run node
      var sourceLinks = links.filter(function (link) {
        return link.target.nodeId === nodeId;
      });
      var nodeInput = resultCache[nodeId];

      // calculate result
      var nodeResult = void 0;
      try {
        nodeResult = node.run(nodeInput);
      } catch (e) {}
      // TODO


      // add result to result cache for next iteration
      links.filter(function (link) {
        return link.source.nodeId === nodeId;
      }).forEach(function (link) {
        set(resultCache, [link.target.nodeId, link.target.path], nodeResult);
      });
    });

    return resultCache.userOutput;
  };

  this.meta = function () {
    return assign({}, meta, {
      nodes: nodes,
      links: links
    });
  };
};

module.exports = Orchestrator;

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