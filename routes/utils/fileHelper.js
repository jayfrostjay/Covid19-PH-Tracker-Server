const fs = require('fs')
const path = require('path')

module.exports = {
  API_DATA_FOLDER: path.resolve('routes/api/data/') + '/',
  saveContentToFile: function (content, file) {
    const fullFileDirectory = this.API_DATA_FOLDER + file;
    fs.writeFileSync(fullFileDirectory, this.stringifyItem(content))
  },
  readFileContent: function (file) {
    const fullFileDirectory = this.API_DATA_FOLDER + file;
    return this.parseJsonContent(fs.readFileSync(fullFileDirectory, 'utf8'));
  },
  stringifyItem: function (item) {
    return JSON.stringify(item);
  },
  parseJsonContent: function (item) {
    return JSON.parse(item);
  }
};