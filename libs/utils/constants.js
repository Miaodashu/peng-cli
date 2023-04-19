const { name, version } = require("../../package.json");
const downloadDirectory = `${
  process.env[process.platform === "darwin" ? "HOME" : "USERPROFILE"]
}/.myTemplate`;


module.exports = {
  name, // 脚手架名称
  version, // 版本号
  downloadDirectory, // 下载到本地的临时目录
};
