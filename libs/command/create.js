const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const chalk = require('chalk')
const Creator = require('./Creator')
module.exports = async (projectName, options) => {
     // 当前工作目录
    const cwd = process.cwd();
    // 当前项目目录
    const targetDir = path.join(cwd, projectName)

    // 判断当前目录下是否存在当前操作的目录名字
    if (fs.existsSync(targetDir)) {
        // 如果命中，则强制安装，先删除已存在目录
        if (options && options.force) {
           await fs.removeSync(targetDir)
        } else {
            // 询问用户，让用户选择覆盖重写还是取消当前操作
            let { action } = await inquirer.prompt([
                {
                    name: 'action',
                    type: 'list',
                    message: '目标目录已存在，请选择新操作',
                    choices: [
                        {name: 'Overwrite', value: 'overwrite'},
                        {name: 'Cancel', value: 'cancel'},
                    ]
                }
            ])
            if (!action) {
                return
            }else if (action === 'overwrite') {
                console.log(chalk.green(`removing...`));
                await fs.removeSync(targetDir)
                console.log(chalk.green(`删除成功`));
            }
            
        }
    }

    // 创建后续新的交互
    const creator = new Creator(projectName,targetDir)
    // 创建项目
    // creator.create();

}