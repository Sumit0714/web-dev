// Usage: node calculator.js <add|sub|mul|div> <num1> <num2>

const args = process.argv.slice(2);
const [operation, a, b] = args;

const num1 = parseFloat(a);
const num2 = parseFloat(b);

function calculate(op, x, y) {
  switch (op) {
    case 'add':
      return x + y;
    case 'sub':
      return x - y;
    case 'mul':
      return x * y;
    case 'div':
      if (y === 0) throw new Error('Division by zero is not allowed');
      return x / y;
    default:
      throw new Error(`Invalid operation "${op}". Use add, sub, mul, or div.`);
  }
}

if (!operation || isNaN(num1) || isNaN(num2)) {
  console.log('Usage: node calculator.js <add|sub|mul|div> <num1> <num2>');
  console.log('Example: node calculator.js add 10 5');
  process.exit(1);
}

try {
  const result = calculate(operation, num1, num2);
  console.log(`Result: ${result}`);
} catch (err) {
  console.log(`Error: ${err.message}`);
}
