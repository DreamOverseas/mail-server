
const fs = require('fs');
const path = require('path');

function loadServices(dirPath) {
  const services = {};
  const absoluteDir = path.resolve(__dirname, '../', dirPath);
  const files = fs.readdirSync(absoluteDir);

  files.forEach(file => {
    const fullPath = path.join(absoluteDir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 递归子目录
      Object.assign(services, loadServices(path.join(dirPath, file)));
    } else if (file.endsWith('.js')) {
      const moduleExports = require(fullPath);
      Object.assign(services, moduleExports);
    }
  });

  return services;
}

module.exports = loadServices;
