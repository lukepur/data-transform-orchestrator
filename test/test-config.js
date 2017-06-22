const { assign } = require('lodash');

const { SYSTEM_IN } = require('../consts');
const arrayPick = require('./transforms/transform-array-pick');
const ema = require('./transforms/transform-ema');

module.exports = {
  nodes: [
    assign({}, arrayPick, { id: 'pickField' }),
    assign({}, ema, { id: 'ema' })
  ],
  links: [
    {
      source: {
        nodeId: SYSTEM_IN,
        path: 'priceField'
      },
      target: {
        nodeId: 'pickField',
        path: 'prop'
      }
    },
    {
      source: {
        nodeId: SYSTEM_IN,
        path: 'priceArray'
      },
      target: {
        nodeId: 'pickField',
        path: 'haystack'
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
        nodeId: '',
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
  ]
};