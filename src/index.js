const toposort = require('toposort');
const { find, assign, set } = require('lodash');

function Orchestrator (config) {
  const { nodes, links, meta } = config;

  this.run = function (userInput) {
    const graph = buildDependencyGraph(links);
    const inputCache = {};
    const resultCache = {};

    // ensure all userInputs are available
    const userInputLinks = links.filter(link => link.source.nodeId === 'userInput');

    const unenteredInputs = userInputLinks.filter(link => userInput[link.source.path] === undefined);

    if (unenteredInputs.length > 0) {
      throw Error('Enentered inputs: ' + unenteredInputs.map(link => link.source.path).join(','));
    }

    // put userInputs into target inputs
    userInputLinks.forEach(link => {
      set(inputCache, [link.target.nodeId, link.target.path], userInput[link.source.path]);
    });

    // good to run...
    for (let i = 0; i < graph.length; i++) {
    // graph.forEach(nodeId => {
      let nodeId = graph[i];
      const node = find(nodes, {id: nodeId});

      if (!node) continue; // user node
      
      // collect inputs to run node
      const sourceLinks = links.filter(link => link.target.nodeId === nodeId);
      const nodeInput = inputCache[nodeId];

      // calculate result
      let nodeResult;
      try {
        nodeResult = node.run(nodeInput);
      } catch (e) {
        // TODO
      }

      // Check if this node has input errors
      if (nodeResult.inputErrors) {
        resultCache.inputErrors = {
          nodeId,
          errors: nodeResult.inputErrors
        };
        return resultCache; // don't process any more nodes
      }

      // add result to input cache for next iteration
      links
        .filter(link => link.source.nodeId === nodeId)
        .forEach(link => {
          set(inputCache, [link.target.nodeId, link.target.path], nodeResult);
        });

      // add result to result cache
      resultCache[nodeId] = {
        output: nodeResult
      };
    };

    return resultCache;
  };

  this.meta = function () {
    return assign({}, meta, {
      nodes,
      links
    });
  };
};

module.exports = Orchestrator;

function buildDependencyGraph(links) {
  const depGraph = [];

  links.forEach(link => {
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
