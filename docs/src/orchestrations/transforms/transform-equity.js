
const createTransformer = require('data-transform-descriptor');

const inputConstraints = [
  {
    id: 'assets',
    type: 'array',
    required: true,
    children: {
      type: 'object',
      children: [
        {
          id: 'description',
          type: 'string'
        },
        {
          id: 'amount',
          type: 'number',
          required: true
        }
      ]
    }
  },
  {
    id: 'liabilities',
    type: 'array',
    required: true,
    children: {
      type: 'object',
      children: [
        {
          id: 'description',
          type: 'string'
        },
        {
          id: 'amount',
          type: 'number',
          required: true
        }
      ]
    }
  }
];

const outputConstraints = [
  {
    id: 'output',
    type: 'number'
  }
];

const fn = input => {
  const assets = input.assets || [];
  const liabilities = input.liabilities || [];
  return assets.reduce((memo, num) => memo + num, 0) - liabilities.reduce((memo, num) => memo + num, 0);
};

const meta = {
  name: 'Equity',
  categories: ['finance']
};

module.exports = createTransformer(inputConstraints, outputConstraints, fn, meta);
