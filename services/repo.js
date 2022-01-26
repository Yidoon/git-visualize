const { excuteCommand, createParser } = require("../utils");
const process = require("process");
const { chdir } = process;
const dayjs = require("dayjs");
const _ = require("lodash");
const childProcess = require("child_process");

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
const defaultPagesize = 99999999;

/**
 * 最晚的一次提交
 */
const getGitLogList = (params, repoPath) => {
  // chdir("/Users/yidoon/Desktop/Code/gitmsg");
  chdir(repoPath);
  return new Promise((resolve, reject) => {
    const p = createParser();
    const k = childProcess.spawn("bash");
    let items = [];
    const { author, commit_content, commit_hash, before, after } = params;
    const pageSize = params.take || defaultPagesize;
    let search_after = undefined;
    let search_before = undefined;
    if (params.after && params.before) {
      search_after =
        dayjs.unix(+params.after).format("YYYY-MM-DD HH:mm:ss") || "";
      search_before =
        dayjs.unix(+params.before).format("YYYY-MM-DD HH:mm:ss") || "";
    }
    // k.stdin.write(
    //   `git log -10 --pretty=format:'{**commit**:**%H**,**commit_notes**:**%N**,**author**:**%aN**,**date**:**%ad**, **email**: **%aE**, **title**: **%s**}' --date=format:'%Y-%m-%d %H:%M:%S' | sed 's/"/\\"/g' | sed 's/\*\*/"/g'`
    // );
    let comStr = `git log `;
    if (params.noMerge) {
      comStr += "--no-merges ";
    }
    const formatStr = `--pretty=format:'{^^^^commit^^^^:^^^^%H^^^^,^^^^commit_notes^^^^:^^^^%N^^^^,^^^^author^^^^:^^^^%aN^^^^,^^^^commit_name^^^^:^^^^%cn^^^^,^^^^date^^^^:^^^^%ad^^^^, ^^^^email^^^^: ^^^^%aE^^^^, ^^^^title^^^^: ^^^^%s^^^^}' --date=format:'%Y-%m-%d %H:%M:%S'`;
    if (params.branch) {
      comStr += `${params.branch} `;
    }
    comStr += formatStr;
    if (after && before) {
      comStr += ` --after="${search_after}" --before="${search_before}" `;
    }
    if (author) {
      comStr += ` --author=${author.trim()} `;
    }
    if (commit_content) {
      comStr += `--grep=${commit_content} `;
    }
    comStr += `| sed 's/"/FLAG/g'  | sed 's/\\^\\^\\^\\^/"/g'`;
    console.log(comStr);
    k.stdin.write(comStr);
    // k.stdin
    //   .write(`git log --pretty=format:'{^^^^date^^^^:^^^^%ci^^^^,^^^^abbreviated_commit^^^^:^^^^%h^^^^,^^^^subject^^^^:^^^^%s^^^^,^^^^body^^^^:^^^^%b^^^^},' | sed 's/"/\\"/g' | sed 's/\^^^^/"/g'
    // `);
    k.stdin.end("\n");
    k.stdout
      .pipe(p)
      .on("data", function (d) {
        try {
          // JSON.parse(String(d));
          const str = String(d);
          const isHasFlag = str.indexOf("FLAG");
          const parseObj = JSON.parse(String(d));
          if (isHasFlag > -1) {
            Object.keys(parseObj).forEach((key) => {
              const index = parseObj[key].indexOf("FLAG");
              if (index > -1) {
                parseObj[key] = parseObj[key].replace(/FLAG/g, '"');
              }
            });
          }
          parseObj["repo_path"] = repoPath;
          items.push(parseObj);
        } catch (error) {
          console.log(error, "err0r1");
        }
      })
      .once("error", () => {
        reject("error");
      })
      .once("end", function () {
        resolve(items);
      });
  });
};
const getCommitByBranchs = async (repoPath, params) => {
  chdir(repoPath);
  const authorCmdStr = "git config user.name";
  const author = await excuteCommand(authorCmdStr, repoPath);
  const branchs = JSON.parse(params.branchs);
  let list = [];
  for (let i = 0, len = branchs.length; i < len; i++) {
    const payload = {
      branch: branchs[i],
      after: params.after,
      before: params.before,
      author,
      noMerge: true,
    };
    const res = await getGitLogList(payload, repoPath);
    list = list.concat(res);
  }
  list = _.uniqBy(list, "commit");
  return list;
};
const getCommitDetail = async (params) => {
  // const cmdStr = ` git ls-tree --name-only -r ${params.commit}`;
  const cmdStr = `git show --stat --oneline ${params.commit}`;
  console.log(cmdStr, "cmdStr");
  const res = await excuteCommand(cmdStr, params.repoPath);
  return res;
};
module.exports = {
  getCodeLineNumOfRepo,
  getGitLogList,
  getCommitByBranchs,
  getCommitDetail,
};
