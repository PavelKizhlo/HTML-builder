const path = require('path');
const { readdir, readFile, stat, mkdir, rm, copyFile, writeFile } = require('fs/promises');
const { stdout } = process;

async function createDist(dirPath) {
  mkdir(dirPath, { recursive: true });
}

async function createIndex(tempPath, compPath, destPath) {
  const compContent = await readdir(compPath);

  const compFiles = [];

  for (const item of compContent) {
    const isFile = (await stat(path.join(compPath, item))).isFile();

    if (isFile) {
      compFiles.push(item);
    }
  }

  const htmlFiles = compFiles.filter(file => path.extname(file) === '.html');
  let template = await readFile(tempPath, { encoding: 'utf-8' });

  for (const frag of htmlFiles) {
    const fragHTML = await readFile(path.join(compPath, frag), { encoding: 'utf-8' });
    const fragName = path.parse(frag).name;

    template = template.replace(`{{${fragName}}}`, fragHTML);
  }

  writeFile(
    path.join(destPath, 'index.html'),
    template
  );
}

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

async function createBundle(srcPath, destPath) {
  const stylesContent = await readdir(srcPath);

  const stylesFiles = [];

  for (const item of stylesContent) {
    const isFile = (await stat(path.join(srcPath, item))).isFile();

    if (isFile) {
      stylesFiles.push(item);
    }
  }

  const cssFiles = stylesFiles.filter(file => path.extname(file) === '.css');

  const cssBufferArr = [];

  for (const file of cssFiles) {
    const cssBuffer = await readFile(path.join(srcPath, file));
    cssBufferArr.push(cssBuffer);
  }

  const cssBufferStr = cssBufferArr.join('\n\n');

  writeFile(
    path.join(destPath, 'style.css'),
    cssBufferStr
  );
}

async function assemble() {
  await createDist(path.join(__dirname, 'project-dist'));
  await createIndex(
    path.join(__dirname, 'template.html'),
    path.join(__dirname, 'components'),
    path.join(__dirname, 'project-dist')
  );
  await copyDir(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist', 'assets')
  );
  await createBundle(
    path.join(__dirname, 'styles'),
    path.join(__dirname, 'project-dist')
  );
}

assemble()
  .then(() => stdout.write('Папка project-dist собрана!\n'))
  .catch(() => stdout.write('Произошла ошибка! Хотя не должна была ...\n'));
