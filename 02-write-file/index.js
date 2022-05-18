const fs = require('fs');
const path = require('path');
const readline = require('readline');

const { stdout } = process;
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const interface = readline.createInterface({
  input: process.stdin,
});

stdout.write('Пожалуйста, введите текст в консоль:\n');

interface.on('line', input => {
  if (input === 'exit') {
    process.exit();
  }

  output.write(`${input}\n`);
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  stdout.write('\nСпасибо! Введённый текст записан в text.txt\n');
});