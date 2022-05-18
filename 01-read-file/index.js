const fs = require('fs');
const path = require('path');

const { stdout } = process;

const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
let text = '';

readableStream.on('data', chunk => text += chunk);
readableStream.on('end', () => stdout.write(text));
readableStream.on('error', error => console.log('Error', error.message));
