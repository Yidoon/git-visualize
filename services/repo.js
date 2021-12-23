const { excuteCommand } = require("../utils");
/**
 * 仓库运行时间
 */

/**
 * 仓库的体积
 */

/**
 * 仓库的分支数
 */

/**
 * 仓库有多少成员
 */

/**
 * 仓库一共有多少行代码
 */

const getCodeLineNumOfRepo = async (repoPath) => {
  const cmdStr = `git log  --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added: %s, removed: %s, total: %s", add, subs, loc }'`;
  try {
    // added lines: 828916, removed lines: 546732, total lines: 282184
    const res = await excuteCommand(cmdStr, repoPath);
    const arr = res.split(",");
    const arrMap = {};
    let tempArr = [];
    arr.forEach((line) => {
      tempArr = line.split(":");
      arrMap[tempArr[0].trim()] = Number(tempArr[1].trim());
    });
    return arrMap;
  } catch (e) {
    return null;
  }
};
/**
 * 最晚的一次提交
 */

module.exports = {
  getCodeLineNumOfRepo,
};
