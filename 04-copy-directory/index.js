const path = require('path');
const { readdir, stat, mkdir, rm, copyFile } = require('fs/promises');
const { stdout } = process;

async function copyDir(dirPath, copyPath) {
  await stat(path.join(copyPath))
    .then(() => {
      return rm(path.join(copyPath), { recursive: true });
    })
    .then(() => {
      mkdir(path.join(copyPath));
    })
    .catch(() => {
      mkdir(path.join(copyPath));
    });

  const files = await readdir(dirPath);

  files.forEach(async (file) => {
    const status = await stat(path.join(dirPath, file));

    if (status.isDirectory()) {
      copyDir(
        path.join(dirPath, file),
        path.join(copyPath, file)
      );
    } else {
      copyFile(
        path.join(dirPath, file),
        path.join(copyPath, file)
      );
    }
  });
}


copyDir(
  path.join(__dirname, 'files'),
  path.join(__dirname, 'files-copy')
)
  .then(() => stdout.write('Копирование папки завершено!\n'))
  .catch(() => stdout.write('Произошла ошибка! Хотя не должна была ...\n'));