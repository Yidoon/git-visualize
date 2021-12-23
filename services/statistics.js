const { excuteCommand } = require("../utils");
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
const getWordCloud = async (repoPath) => {
  const cmdStr = "git log --no-merges --pretty='%an,%B<vsz />'";
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

      result[name] = sortArray.sort((a, b) => b.value - a.value).slice(0, 100);
    });
    return result;
  } catch (e) {
    console.log(e);
    return {
      error: "error",
    };
  }
};
module.exports = {
  getWordCloud,
};
