const path = require("path");

const rootPath = __dirname;
console.log(rootPath);

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, "public", "uploads")
};