// 拉取当前组织下的模版
// 通过模版找到版本号信息
// 下载当前的模版
// 下载安装依赖信息
const { wrapLoading } = require("../utils/util");
const inquirer = require("inquirer");
const downloadGitRepo = require("download-git-repo");
const path = require("path");
const { fetchRepoList, fetchTagList } = require("../utils/request");
const util = require("util");
const chalk = require('chalk')
const tplObj = require(`${__dirname}/../../template`);
const ora = require("ora");
const cp = require('child_process')
module.exports = class Creator {
  constructor(projectName, targetDir) {
    this.name = projectName;
    this.target = targetDir;
    this.downloadGit = util.promisify(downloadGitRepo);
  }
  //真实开始创建了
  async create() {
    console.log(this.name, this.target);
    // 先让用户选择模板
    let url = await this.selectTemplate();
    // 下载当前的模版
    await this.download(url);

    // 下载依赖
    // await downloadNodeModules(this.name)
  }

  async selectTemplate() {
    if (!Object.keys(tplObj).length) {
      log.warning(`\r请先添加项目模板`);
      return;
    }
    const choices = Object.keys(tplObj).map((el) => {
      return {
        name: el,
        value: tplObj[el],
      };
    });
    console.log(choices);

    const question = [
      {
        name: "url",
        type: "list",
        message: "请选择基础模板",
        choices,
      },
    ];
    let { url } = await inquirer.prompt(question)
    return url
  }


  async fetchRepo() {
    //可能存在获取失败情况 失败需要重新获取
    let repos = await wrapLoading(fetchRepoList, "waiting fetch template");
    if (!repos) return;
    //获取模版中的名字
    repos = repos.map((item) => item.name);

    //获取要创建的版本信息
    let { repo } = await Inquirer.prompt({
      name: "repo",
      type: "list",
      choices: repos,
      message: "please choose a template to create project",
    });
    //获取到了模版仓库
    return repo;
  }

  async download(requestUrl) {
    console.log(`----begin to download from---`, chalk.green(requestUrl));
    // //2.把路径资源下载到某个路径上(后续可以增加缓存功能)
    // //应该下载下载到系统目录中，后续可以使用ejs handlerbar 进行渲染，最后生成结果并写入`${repo}@${tag}`
    // let result = await wrapLoading(() => {
    //   this.downloadGit(requestUrl, path.resolve(process.cwd(), this.target));
    // }, "下载中...");
    // return result;

    // 出现加载图标
    const spinner = ora("Downloading...");
    spinner.start();

    // 执行下载方法 并传入参数
    this.downloadGit(requestUrl, path.resolve(process.cwd(), this.target), (err) => {
      if (err) {
        spinner.fail();
        console.log(chalk.red(`生成失败. ${err}`));
        return;
      }
      // 结束加载图标
      spinner.succeed();
      // console.log(
      //   `\rplease enter file ${tchalk.green(this.name)}  to install dependencies`
      // );
      // console.log(chalk.green(`\n cd ${this.name} \n npm install \n`));
      this.downloadNodeModules()
    });
  }

  async downloadNodeModules(downLoadUrl) {
    console.log(chalk.green("\n √ Generation completed!"));
    const execProcess = `cd ${this.name} && npm install`;
    const spinner = ora("Downloading node_modules...");
    let that = this
    spinner.start();
    //执行安装node_modules的以来
    // cp.exec(execProcess, function (error, stdout, stderr) {
    //   //如果下载不成功 则提示进入目录重新安装
    //   if (error) {
    //     spinner.fail();
    //     console.log(chalk.red(`安装依赖失败. ${error}`));
    //     spinner.warn(`\rplease enter file《 ${that.name} 》 to install dependencies`);

    //     console.log(chalk.green(`\n cd ${that.name} \n npm install \n`));
    //     process.exit();
    //   } else {
    //     spinner.succeed('安装依赖成功');
    //     //如果成功则直接提示进入目录 执行即可
    //     console.log(chalk.green(`\n cd ${that.name} \n npm run server \n`));
    //   }
    //   process.exit();
    // });
    const execa = require("execa");
  
    execa(`${execProcess}`, {
      cwd: this.target,
      stdio: [2, 2, 2],
    });
    return true;
  }
};
