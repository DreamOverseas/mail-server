const fs = require('fs');
const path = require('path');

function loadServices(dirPath) {
  const services = {};

  const absoluteDir = path.resolve(__dirname, '../', dirPath);
  const files = fs.readdirSync(absoluteDir);

  files.forEach(file => {
    if (file.endsWith('.js')) {
      const modulePath = path.join(absoluteDir, file);
      const moduleExports = require(modulePath);

      // Merge all named exports into `services`
      Object.assign(services, moduleExports);
    }
  });

  return services;
}

module.exports = loadServices;
