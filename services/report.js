const { getGitLogList } = require("./repo");
const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");
const { excuteCommand } = require("../utils");

const CRM_FE = "/Users/yidoon/Desktop/shifang/crm-fe";
const SHOP_FE = "/Users/yidoon/Desktop/shifang/shop-fe";
const STUDY_FE = "/Users/yidoon/Desktop/shifang/study-fe";
const NUWA_IM_FE = "/Users/yidoon/Desktop/shifang/nuwa-im-fe";
// const CONTRIBUTORS_JSON_MAP = {
//   "yidong.deng": "dengyidong",
//   Yidong: "dengyidong",
// };
// const CONTRIBUTORS_NAME_MAP = {
//   dengyidong: "邓奕东",
// };
const REPOS = [CRM_FE, SHOP_FE, STUDY_FE, NUWA_IM_FE];

// 将所有人的commit都写进一个json文件

const writeFile = async (filePath, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        reject(false);
        return;
      }
      console.error("文件写入成功");
      resolve(true);
    });
  });
};
const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      reject({
        msg: "文件不存在",
        data: false,
        err: "",
      });
    }
    try {
      const data = fs.readFileSync(filePath, "utf8");
      resolve({
        msg: "",
        data: data,
        err: "",
      });
    } catch (error) {
      resolve({
        msg: "",
        data: "",
        err: error,
      });
    }
  });
};
// const genCommitJson = async () => {
//   const params = {
//     author: "yidong.deng",
//     after: dayjs("2021-01-01").unix(),
//     before: dayjs("2021-12-31").unix(),
//     noMerge: true,
//   };
//   const res = await getGitLogList(params, CRM_FE);
//   const filePath = path.resolve(__dirname, `../json/yidong.json`);
//   if (fs.existsSync(filePath)) {
//     await writeFile(filePath, JSON.stringify(res));
//   } else {
//     try {
//       fs.appendFileSync(filePath, JSON.stringify(res), "utf-8");
//     } catch (error) {
//       console.log(error, "error");
//       console.log("写入失败");
//     }
//   }
//   console.log(res, "resss");
//   return res;
// };
const genJsonByRepos = async (params, repoPaths) => {
  let commitArr = [];
  params.noMerge = false;
  for (let i = 0; i < repoPaths.length; i++) {
    let res = await getGitLogList(params, repoPaths[i]);
    commitArr = commitArr.concat(res);
  }
  const filePath = path.resolve(__dirname, `../json/${params.author}.json`);
  if (!fs.existsSync(filePath)) {
    try {
      fs.appendFileSync(filePath, JSON.stringify(commitArr), "utf-8");
      return {
        msg: "",
        data: true,
        err: "",
      };
    } catch (error) {
      return {
        msg: "写入失败",
        data: false,
        err: error,
      };
    }
  }
};
const genCommitJson = async (params, repoPath) => {
  return new Promise(async (resolve, reject) => {
    const res = await getGitLogList(params, repoPath);
    const filePath = path.resolve(__dirname, `../json/yidong.json`);
    if (fs.existsSync(filePath)) {
      await writeFile(filePath, JSON.stringify(res));
      resolve({
        msg: "",
        data: true,
        err: "",
      });
    } else {
      try {
        fs.appendFileSync(filePath, JSON.stringify(res), "utf-8");
        resolve({
          msg: "",
          data: true,
          err: "",
        });
      } catch (error) {
        reject({
          msg: "写入失败",
          data: false,
          err: error,
        });
      }
    }
  });
};
// 1、TODO: DONE 在每个人的json文件里，找第一条commit，比对出第一条commit
const getFirstCommit = async (filePath) => {
  const { data, msg, err } = await readFile(filePath);
  let dataArr = JSON.parse(data);
  dataArr = dataArr.sort((a, b) => {
    return dayjs(a.date).unix() - dayjs(b.date).unix();
  });
  const firseCommit = dataArr[0];
  return firseCommit;
};
/**
 * 将时间分成三部分 【早上】【正常上班】【加班】，把commit提交的时间，归类进这其中的一个
 * @param date
 * @returns
 */
const calcDateBelong = (date) => {
  const dateUnix = dayjs(date).unix();
  const s = dayjs(date).startOf("day").format("YYYY-MM-DD HH:mm:ss");
  // 早上 00:00:00
  const t1 = dayjs(s).unix();
  // 早上 09:00:00
  const t2 = dayjs(s).add(6, "hour").unix();
  // 下午 18:00:00
  const t3 = dayjs(s).add(18, "hour").unix();
  // 晚上 23:59:59
  const t4 = dayjs(date).endOf("day").unix();
  if (dateUnix > t1 && dateUnix <= t2) {
    return ["morning", dateUnix - t1];
  }
  if (dateUnix > t2 && dateUnix <= t3) {
    return ["normal", t3 - dateUnix];
  }
  if (dateUnix <= t4) {
    return ["night", t4 - dateUnix];
  }
  return ["unkonw", 0];
};
const cateCommitByDate = (data) => {
  const map = {
    morning: [],
    normal: [],
    night: [],
  };
  let commit;
  for (let i = 0; i < data.length; i++) {
    commit = data[i];
    const { date } = commit;
    try {
      const [belong, diff] = calcDateBelong(date);
      map[belong].push({ ...commit, diff: diff, type: belong });
    } catch (error) {
      console.log(error);
    }
  }
  return map;
};
// 2、TODO: DONE 获取最晚的一次提交
const getLastestCommit = async (filePath) => {
  const { data, msg, err } = await readFile(filePath);
  let commitArr = JSON.parse(data);
  const cateDataMap = cateCommitByDate(commitArr);
  const { morning, normal, night } = cateDataMap;
  const arrKey =
    morning.length > 0 ? "morning" : night.length > 0 ? "night" : "normal";
  const arr = cateDataMap[arrKey];
  arr.sort((a, b) => {
    return a.diff - b.diff;
  });
  return arr[0];
};
// 3、TODO: DONE 获取commit个数
const getCommitCount = async (filePath) => {
  const { data, msg, err } = await readFile(filePath);
  let commitArr = JSON.parse(data);
  return commitArr.length;
};

// 4、TODO: DONE 统计每一个人写的代码行数 以及commit数量（直接统计 json文件的数量， wc-l）
const getCodeLine = async (params, repoPath) => {
  const author = params.author;
  if (!author) return;
  const before = "2021-12-31";
  const after = "2021-01-01";
  const cmdStr = `git log --author="${author}"  --after="${after}" --before="${before}" --no-merges --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "%s", loc }'`;
  const res = await excuteCommand(cmdStr, repoPath);
  return res;
};

// TODO: DONE 计算提交次数最多的一天
// 5、遍历 json，以日期为 key,commit为值，找出哪天提交的代码最多。以及那天写的代码最多。   以及哪天最晚的时间
const calcMostCommitDay = async (filePath) => {
  console.log(filePath, "fff");
  const { data, msg, err } = await readFile(filePath);
  let commitArr = JSON.parse(data);
  console.log(commitArr.length, "commitArr");
  const dateCommitMap = {};
  let tempDate;
  commitArr.forEach((commit) => {
    tempDate = dayjs(commit.date).format("YYYY-MM-DD");
    if (dateCommitMap[tempDate]) {
      dateCommitMap[tempDate].push(commit);
    } else {
      dateCommitMap[tempDate] = [commit];
    }
  });
  let count = 0;
  let finalDate = "";
  Object.keys(dateCommitMap).forEach((date) => {
    if (dateCommitMap[date].length > count) {
      count = dateCommitMap[date].length;
      finalDate = date;
    }
  });
  return [finalDate, count];
};

const generateData = async (params) => {
  // await genCommitJson(params, CRM_FE);
  await genJsonByRepos(params, REPOS);
  // const jsonPath = path.resolve(__dirname, `../json/yidong.json`);
  const jsonPath = path.resolve(__dirname, `../json/${params.author}.json`);
  try {
    // 第一个commit
    const firstCommit = await getFirstCommit(jsonPath);
    // 获取commit数量
    const commitCount = await getCommitCount(jsonPath);
    // 最晚的commit
    const lastestCommit = await getLastestCommit(jsonPath);
    // 获取代码提交次数最多的一天
    const [mostCommitDate, count] = await calcMostCommitDay(jsonPath);

    // 获取代码行数
    const codeLine = await getCodeLine({ author: params.author }, CRM_FE);

    return {
      first_commit: firstCommit,
      lastest_commit: lastestCommit,
      code_line: +codeLine,
      commit_count: commitCount,
      most_commit: {
        date: mostCommitDate,
        count: count,
      },
    };
  } catch (error) {
    console.log(error, "error");
    return {};
  }
};

// 4、年度关键字，词云

// 5、总结！

module.exports = {
  genCommitJson,
  getFirstCommit,
  generateData,
};
