const childProcess = require("child_process");
const { createDataParser, getMonthOfYear, excuteCommand } = require("../utils");
const process = require("process");
const dayjs = require("dayjs");

const { chdir } = process;

const peoples = {
  王志君: "王志君",
  songsiwei: "songsiwei",
  lurui: "lurui",
  "yao.li": "yao.li",
  余真恒: "余真恒",
  "wei.ouyang": "wei.ouyang",
  谢业江: "xieyejiang",
  "liyao.liu@tenclass.com": "liyao.liu@tenclass.com",
  蚁懂: "蚁懂",
  "endi.zhu": "endi.zhu",
  "dong.yi": "蚁懂",
  "yidong.deng": "yidong.deng",
  "allen.ouyang": "wei.ouyang",
  "Allen.ouyang": "wei.ouyang",
  ryan: "lurui",
  Yidong: "yidong.deng",
  WzhUPUP: "wangzhihao",
  "wuhou.li": "wuhou.li",
  zhujiahao: "zhujiahao",
  阿五: "wuhou.li",
  xieyejiang: "xieyejiang",
  wangzhihao: "wangzhihao",
  "zhijun.wang": "王志君",
  王志豪: "wangzhihao",
  李瑶: "yao.li",
  鲁锐: "lurui",
  邓奕东: "yidong.deng",
  siweisong: "songsiwei",
  业江: "xieyejiang",
  欧阳伟: "wei.ouyang",
  zhued: "endi.zhu",
  宋思伟: "songsiwei",
  Yidoon: "yidong.deng",
};
/**
 * contributors and theirs commits
 * @returns
 */
const getContributor = async (repoPath) => {
  if (repoPath) {
    chdir(repoPath);
  }
  const items = [];
  const cmdStr = "git shortlog -sn --all";
  const p = createDataParser();
  const k = childProcess.spawn("bash");
  return new Promise((resolve, reject) => {
    k.stdin.write(cmdStr);
    k.stdin.end("\n");
    k.stdout.pipe(p).on("data", (data) => {
      const f = data.trim().replace(/\s+/, "_");
      const arr = f.split("_");
      const item = {
        commit_count: arr[0],
        contributor: arr[1],
      };
      items.push(item);
      resolve(items);
    });
  });
};
const getContributorCommitData = async (repoPath) => {
  const contributors = await getContributor(repoPath);
  const resultMap = {};
  contributors.forEach((item) => {
    let key = peoples[item.contributor.trim()];
    if (key) {
      if (resultMap[key]) {
        resultMap[key] = +item.commit_count + resultMap[key];
      } else {
        resultMap[key] = +item.commit_count;
      }
    }
  });
  const result = Object.keys(resultMap).map((key) => {
    return {
      name: key,
      value: resultMap[key],
    };
  });
  return result;
};
const getContributorCommitDataByMonth = async (repoPath, contributor) => {
  if (repoPath) {
    chdir(repoPath);
  }
  const mongthArr = getMonthOfYear();
  let cmdStr = "";
  let authorStr = "";
  const result = [];
  for (let i = 0; i < mongthArr.length; i++) {
    authorStr = contributor ? `--author="${contributor}"` : "";
    cmdStr = `git log --no-merges --after="${mongthArr[i].start}" --before="${mongthArr[i].end}" ${authorStr} | wc -l`;
    const res = await excuteCommand(cmdStr, repoPath);
    result.push({
      month: dayjs(mongthArr[i].start).get("month") + 1,
      commit: +res.trim(),
    });
  }
  return result;
};

module.exports = {
  getContributor,
  getContributorCommitData,
  getContributorCommitDataByMonth,
};
