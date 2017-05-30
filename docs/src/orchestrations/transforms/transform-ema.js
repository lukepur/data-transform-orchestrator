const Transformer = require('data-transform-descriptor');

const inputConstraints = [
  {
    id: 'target',
    type: 'array',
    required: true,
    children: {
      type: 'number',
      required: true
    }
  },
  {
    id: 'periods',
    type: 'number',
    required: true
  }
];

const outputConstraints = [
  {
    id: 'output',
    type: 'array',
    children: {
      type: 'number'
    }
  }
];

const fn = input => {
  const { target, periods } = input;
  const result = [];
  let i;
  for (i = 0; i < periods; i += 1) {
    const data = target[i];
    if (data === undefined) return result;
    result.push(sum(target.slice(0, i + 1)) / (i + 1));
  }

  const k = 2 / (periods + 1);

  for (; i < target.length; i += 1) {
    const data = target[i];
    result.push((data - result[i - 1]) * k + result[i - 1]);
  }

  return result;
}

const meta = {
  name: 'EMA'
};

module.exports = new Transformer(inputConstraints, outputConstraints, fn, meta);

const sum = arr => arr.reduce((memo, item) => memo + item, 0);

// const result = fn({
//   target: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,14,13,12,11,10,9,8,7,6,5,4,3,2,1],
//   periods: 13
// });

// console.log(result);
