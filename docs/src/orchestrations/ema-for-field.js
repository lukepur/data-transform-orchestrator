const Orchestrator = require('data-transform-orchestrator');
const { assign } = require('lodash');

const csvToJS = require('./transforms/transform-csv-js');
const arrayPick = require('./transforms/transform-array-pick');
const ema = require('./transforms/transform-ema');
const echo = require('./transforms/transform-echo');

const config = {
  nodes: [
    assign({}, csvToJS, { id: 'csvtojs' }),
    assign({}, arrayPick, { id: 'pickField' }),
    assign({}, ema, { id: 'ema' }),
    assign({}, echo, { id: 'finalOutput' })
  ],
  links: [
    {
      source: {
        nodeId: 'systemIn',
        path: 'csv'
      },
      target: {
        nodeId: 'csvtojs',
        path: 'source'
      }
    },
    {
      source: {
        nodeId: 'csvtojs',
        path: 'output'
      },
      target: {
        nodeId: 'pickField',
        path: 'haystack'
      }
    },
    {
      source: {
        nodeId: 'systemIn',
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
        nodeId: 'systemIn',
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
        nodeId: 'finalOutput',
        path: 'source'
      }
    }
  ],
  meta: {
    name: 'EMA for field'
  }
};

module.exports = new Orchestrator(config);
module.exports.config = config;

