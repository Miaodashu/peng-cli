#!/usr/bin/env node

// 交互式命令行
const inquirer = require("inquirer");
// 修改控制台字符串样式
const chalk = require("chalk");
const fs = require("fs");
// 读取根目录下的template.json
const tplObj = require(`${__dirname}/../../template`);

// 自定义交互式命令行的问题和简单校验

let question = [
  {
    name: "name",
    type: "input",
    message: "请输入模板名称",
    validate(val) {
      if (val === "") {
        return "请输入模板名称";
      } else if (tplObj[val]) {
        return "模板已存在!";
      } else {
        return true;
      }
    },
  },
  {
    name: "type",
    type: "rawlist",
    message: "请选择模板仓库类型",
    choices: [
      {
        name: "github:",
      },
      {
        name: "gitlab:",
      },
      {
        name: "Bitbucket:",
      },
    ],
  },
  {
    name: "url",
    type: "input",
    message: "请输入模板地址",
    validate(val) {
      if (val === "") return "请输入模板地址";
      return true;
    },
  },
];

inquirer.prompt(question).then((options) => {
  // options是用户输入的参数  是一个对象
  let { name, url, type } = options;
  // 过滤 unicode 字符
  tplObj[name] = type + url.replace(/[\u0000-\u0019]/g, "");
  // 把模板信息写入template.json文件中
  fs.writeFile(
    `${__dirname}/../../template.json`,
    JSON.stringify(tplObj),
    "utf-8",
    (error) => {
      if (error) console.log(error);
      console.log("\n");
      console.log(chalk.green("Added successfully!\n"));
      console.log(chalk.grey("The latest template list is: \n"));
      console.log(tplObj);
      console.log("\n");
    }
  );
});
