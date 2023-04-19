const ora = require("ora");
//请求失败的时候进行睡眠在请求
async function sleep(n) {
  var timer = null;
  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      //执行请求
      resolve();
      clearTimeout(timer);
    }, n);
  });
}
// loading 函数效果
async function wrapLoading(fn, message, args) {
  const spiner = ora(message);
  spiner.start();
  try {
    let repos = await fn(args);
    spiner.succeed('succeed!');
    return repos;
  } catch (error) {
    spiner.fail("request failed , refetching...", args);
    // 等待1s再去请求
    // sleep(1000);
    //重复执行这个请求
    // return wrapLoading(fn, message, args);
  }
}

module.exports = {
    sleep,
    wrapLoading
}
