const childProcess = require("child_process");
const { excuteCommand } = require("../utils");

const formatBranch = (str) => {
  const normalStr = str.replace("*", "");
  const list = normalStr.split("\n");
  list.pop();
  return list.map((item) => {
    return item.trim();
  });
};
/**
 * 获取本地分支数量
 * @param {} repoPath 
 * @returns 
 */
const getLocalBranches = async (repoPath) => {
  return new Promise((resolve, reject) => {
    const cmdStr = "git branch";
    excuteCommand(cmdStr, repoPath).then((res) => {
      const data = formatBranch(res);
      resolve(data);
    });
  });
};

module.exports = {
  getLocalBranches,
};
