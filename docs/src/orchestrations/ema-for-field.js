const Orchestrator = require('data-transform-orchestrator');
const { assign } = require('lodash');

const arrayPick = require('./transforms/transform-array-pick');
const ema = require('./transforms/transform-ema');

module.exports = new Orchestrator({
  nodes: [
    assign({}, arrayPick, { id: 'pickField' }),
    assign({}, ema, { id: 'ema' })
  ],
  links: [
    {
      source: {
        nodeId: 'userInput',
        path: 'priceArray'
      },
      target: {
        nodeId: 'pickField',
        path: 'haystack'
      }
    },
    {
      source: {
        nodeId: 'userInput',
        path: 'priceField'
      },
      target: {
        nodeId: 'pickField',
        path: 'prop'
      }
    },
    {
      source: {
        nodeId: 'pickField',
        path: 'output'
      },
      target: {
        nodeId: 'ema',
        path: 'target'
      }
    },
    {
      source: {
        nodeId: 'userInput',
        path: 'periods'
      },
      target: {
        nodeId: 'ema',
        path: 'periods'
      }
    },
    {
      source: {
        nodeId: 'ema',
        path: 'output'
      },
      target: {
        nodeId: 'userOutput',
        path: 'output'
      }
    }
  ],
  meta: {
    name: 'EMA for field'
  }
});

