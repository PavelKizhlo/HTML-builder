const path = require('path');
const { readdir, stat } = require('fs/promises');
const { stdout } = process;



(async function (folder) {
  try {
    const files = (await readdir(folder, { withFileTypes: true })).
      filter(dirent => dirent.isFile());

    files.forEach(file => {
      const filePath = path.join(__dirname, 'secret-folder', file.name);
      const fileName = path.parse(filePath).name;
      const fileExt = path.extname(filePath).slice(1);
      const fileInfo = stat(filePath);

      fileInfo.then(info => {
        const fileSize = info.size / 1000 + ' kb';
        const fileData = fileName + ' - ' + fileExt + ' - ' + fileSize;

        stdout.write(`${fileData}\n`);
      });
    });
  } catch (error) {
    console.error('Произошла ошибка:', error.message);
  }
})(path.join(__dirname, 'secret-folder'));
