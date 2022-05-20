const path = require('path');
const { readdir, readFile, writeFile, stat } = require('fs/promises');


async function createBundle() {
  // Читаем всё содержимое папки styles
  const stylesContent = await readdir(path.join(__dirname, 'styles'));

  // Выбираем только файлы
  const stylesFiles = [];

  for (const item of stylesContent) {
    const isFile = (await stat(path.join(__dirname, 'styles', item))).isFile();

    if (isFile) {
      stylesFiles.push(item);
    }
  }

  // Выбираем файлы с расширением .css
  const cssFiles = stylesFiles.filter(file => path.extname(file) === '.css');

  // Записываем данные всех файлов в массив
  const cssBufferArr = [];

  for (const file of cssFiles) {
    const cssBuffer = await readFile(path.join(__dirname, 'styles', file));
    cssBufferArr.push(cssBuffer);
  }

  // Создаём файл bundle.css в папке project-dist
  writeFile(
    path.join(__dirname, 'project-dist', 'bundle.css'),
    cssBufferArr
  );
}

createBundle()
  .then(() => console.log('bundle.css создан! Ищите его в папке project-dist'))
  .catch(() => console.log('Произошла ошибка! Хотя не должна была ...'));