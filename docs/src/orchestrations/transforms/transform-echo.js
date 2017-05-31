const createTransformer = require('data-transform-descriptor');
const { clone } = require('lodash');

const inputConstraints = [
  {
    id: 'source',
    type: 'any',
    required: true
  }
];

const outputConstraints = [
  {
    id: 'output',
    type: 'any'
  }
];

const fn = input => {
  return clone(input.source);
};

const meta = {
  name: 'Echo'
};

module.exports = createTransformer(inputConstraints, outputConstraints, fn, meta);
