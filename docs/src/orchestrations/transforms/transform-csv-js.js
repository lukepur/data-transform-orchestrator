const createTransformer = require('data-transform-descriptor');
const papa = require('papaparse');
const { assign } = require('lodash');

const inputConstraints = [
  {
    id: 'source',
    type: 'string',
    required: true,
    opts: {
      multiline: true
    }
  },
  {
    id: 'config',
    type: 'object'
  }
];

const outputConstraints = [
  {
    id: 'output',
    type: 'array'
  }
];

const fn = input => {
  const config = assign({
    header: true,
    dynamicTyping: true
  }, input.config);
  return papa.parse(input.source, config).data;
};

const meta = {
  name: 'CSV to JS'
};

module.exports = createTransformer(inputConstraints, outputConstraints, fn, meta);
