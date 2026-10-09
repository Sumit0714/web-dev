const isEven = require('./modules/isEven');
const log = require('./modules/logger');

log('App started');

const numbers = [4, 7, 10, 13, 22];

numbers.forEach((num) => {
  const result = isEven(num) ? 'even' : 'odd';
  log(`${num} is ${result}`);
});

log('App finished');
