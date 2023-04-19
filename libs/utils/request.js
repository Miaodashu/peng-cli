const axios = require('axios')
async function fetchRepoList() {
  //可以通过配置文件拉取不同的仓库对应下载的文件
  let name = 'Miaodashu/vue-admin-template'
  let result = await axios.get(`https://api.github.com/orgs/${name}/repos`);
  return result;
}

//获取当前的模版tag的信息 repo是我们选择的模版的名称
async function fetchTagList(repo) {
  //可以通过配置文件拉取不同的仓库对应下载的文件
  console.log(repo);
  if (!repo) return;
  let result = await axios.get(
    `https://api.github.com/repos/yourName/${repo}/tags`
  );
  return result;
}
module.exports = {
  fetchRepoList,
  fetchTagList,
};
