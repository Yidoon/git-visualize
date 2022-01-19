const { excuteCommand, getNearlyDays } = require("../utils");
const dayjs = require("dayjs");
const nodejieba = require("nodejieba");

const BLACK_LIST = [];
// 特殊字符
const specialStringPattern =
  /[~!@#$%^&*()_\-+=`\[\]{}|\\;:'",<.>\/?～！@¥（）——「」【】、；：‘“”’《》，。？]+/g;
// 英文字符
const enPattern = /\w+/g;
// 非英文字符
const notEnPattern = /[^a-zA-Z]+/g;
/**
 * @description 把 commit 信息进行拆解
 * @param {string} msg
 * @returns {Map}
 */
const splitCommitMsg = (msg) => {
  const data = new Map();
  msg = msg.replace(specialStringPattern, " ");
  // 对英文单词进行分割
  const en = msg.replace(notEnPattern, " ").trim().split(" ");
  const notEn = msg.replace(enPattern, " ").trim();
  const word = nodejieba.cut(notEn);

  en.forEach((item) => {
    if (!item) return;
    data.set(item, data.get(item) + 1 || 1);
  });
  word.forEach((item) => {
    if (!item.trim()) return;

    data.set(item, data.get(item) + 1 || 1);
  });

  return data;
};

/**
 * @description 合并两个关键词的对象
 */
const mergeSplitData = (baseData, addData) => {
  baseData = baseData || new Map();

  for (let [key, value] of addData) {
    const baseValue = baseData.get(key) || 0;
    baseData.set(key, baseValue + addData.get(key));
  }

  return baseData;
};
const getWordCloud = async (repoPath, contributor) => {
  const authorStr = contributor ? `--author="${contributor}"` : "";
  const cmdStr = `git log --no-merges ${authorStr} --pretty='%an,%B<vsz />'`;
  console.log(cmdStr);
  const authorCommitMsg = {};
  const result = {};
  const pattern = /([^,]+)(.*)/;
  try {
    const res = await excuteCommand(cmdStr, repoPath);
    const lineData = String(res).split("<vsz />");
    lineData.forEach((line) => {
      line = line.replace(/[\n\r\f]+/, "");
      if (!line) return;

      const match = line.match(pattern);
      const author = match[1];
      const msg = match[2].slice(1);

      if (!author || BLACK_LIST.includes(author)) return;

      authorCommitMsg[author] = mergeSplitData(
        authorCommitMsg[author],
        splitCommitMsg(msg)
      );
      authorCommitMsg["all"] = mergeSplitData(
        authorCommitMsg["all"],
        splitCommitMsg(msg)
      );
    });
    const authorName = Object.keys(authorCommitMsg);
    authorName.forEach((name) => {
      const mapData = authorCommitMsg[name];
      const sortArray = [];

      for (let [name, value] of mapData) {
        sortArray.push({
          name,
          value,
        });
      }

      result[name] = sortArray.sort((a, b) => b.value - a.value).slice(0, 200);
    });
    return result;
  } catch (e) {
    console.log(e);
    return {
      error: "error",
    };
  }
};
/**
 * 获取本周commit概览
 */
const getWeekCommitView = async (repoPath) => {
  const result = [];
  const daysArr = getNearlyDays(14);
  let cmdStr = "";
  let startDay, endDay;
  let tempRes;
  for (let i = 0, len = daysArr.length; i < len; i++) {
    startDay = dayjs(daysArr[i]).startOf("day");
    endDay = dayjs(daysArr[i]).endOf("day");
    cmdStr = `git log  --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Cblue %s %Cgreen(%cd) %C(bold blue)<%an>%Creset' --before="${endDay}" --after="${startDay}" --date=format:'%Y-%m-%d %H:%M:%S' --no-merges | wc -l`;
    tempRes = await excuteCommand(cmdStr, repoPath);
    result.push({ date: daysArr[i], count: Number(tempRes.trim()) });
  }
  const weekCommit = result.slice(7, 14);
  const preWeekCommit = result.slice(0, 7);
  const weekCommitCount = weekCommit.reduce((pre, next) => {
    return pre + next.count;
  }, 0);
  const preWeekCommitCount = preWeekCommit.reduce((pre, next) => {
    return pre + next.count;
  }, 0);
  const abs = Math.abs(weekCommitCount - preWeekCommitCount);
  const rate = abs / weekCommitCount;
  return {
    week_commit: weekCommit,
    total_week_commit_count: weekCommitCount,
    up_rate: (rate * 100).toFixed(2),
  };
};

module.exports = {
  getWordCloud,
  getWeekCommitView,
};
