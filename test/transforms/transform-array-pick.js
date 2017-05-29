const createTransformer = require('data-transform-descriptor');

const inputConstraints = [
  {
    id: 'haystack',
    type: 'array',
    required: true,
    children: {
      type: 'object',
      required: true
    }
  },
  {
    id: 'prop',
    type: 'string',
    required: true
  }
];

const outputConstraints = [
  {
    id: 'output',
    type: 'array'
  }
];

const fn = input => {
  return input.haystack.map(item => item[input.prop]);
};

const meta = {
  name: 'Array Pick'
};

module.exports = createTransformer(inputConstraints, outputConstraints, fn, meta);
