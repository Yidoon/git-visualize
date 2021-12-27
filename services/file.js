const { excuteCommand } = require("../utils");
const fs = require("fs");

/**
 *  @desc  判断文件/文件夹是否在 git 跟踪下
 *  @params  {String}  file  文件/文件夹的路径
 *
 *  @return  {Promise}
 */
async function isGitTrack(file, repoPath) {
  return new Promise((resolve, reject) => {
    const cmdStr = `git ls-files ${file}`;
    excuteCommand(cmdStr, repoPath)
      .then((res) => {
        resolve(!!res);
      })
      .catch((err) => resolve(false));
  });
}
/**
 *  @desc  获取文件的后缀
 *  @params  {String}  file  文件名称
 *
 *  @return  {String}  文件后缀
 */
function getFileExt(file) {
  // 以 . 开头的文件
  if (file[0] === ".") {
    return file[0];
  }
  let tmp = file.split(".");

  return tmp[tmp.length - 1];
}
function isFile(path) {
  return fs.lstatSync(path).isFile();
}
function isFolder(path) {
  return fs.lstatSync(path).isDirectory();
}
function calcFileSize(file) {
  return fs.statSync(file).size;
}
/**
 *  @desc  判断文件是否符合统计范围
 *  @params  {String} file  文件名称，不包含路径
 *  @params  {Array}  fileType  统计的文件类型
 *
 *  @return  {Boolean}  判断文件是否有效
 */
function isValidFile(file, fileType) {
  //   // 跳过当前文件统计
  //   if (skipFile(file)) return false;

  let ext = getFileExt(file);
  // 匹配所有的文件
  if (fileType[0] === "*") return true;

  return fileType.indexOf(ext) > -1;
}
const calcFileCodeLine = async (file) => {
  const cmdStr = `git ls-files ${file} | xargs wc -l`;
};
const getFileCommitCount = async (file, repoPath) => {
  const cmdStr = `git log --oneline --no-merges '${file}' | wc -l`;
  const res = await excuteCommand(cmdStr, repoPath);
  return res;
};
const traverRepoToGetInfo = async (repoPath) => {
  const fileCodeLineMap = {};
  const fileSizeMap = {};
  const fileCommitCountMap = {};
  let fileCount = 0;
  let foderCount = 0;
  const loop = async (path) => {
    const isFileTrack = await isGitTrack(path, repoPath);
    if (isFileTrack) {
      let files = fs.readdirSync(path);
      for (let i = 0, len = files.length; i < len; i++) {
        let fileName = files[i];
        let file = `${path}/${fileName}`;
        if (isFolder(file)) {
          foderCount += 1;
          await loop(file);
        } else {
          const fileSize = calcFileSize(file);
          const fileCommitCount = (fileSizeMap[`${file}`] = fileSize);
          try {
            fileCommitCountMap[`${file}`] = await getFileCommitCount(
              file,
              repoPath
            );
          } catch {}
          fileCount += 1;
        }
      }
    }
  };
  await loop(repoPath);
  const arr = Object.keys(fileSizeMap).map((key) => {
    return {
      count: fileSizeMap[key],
      file: key,
    };
  });
  const totalSize = arr.reduce((cur, next) => {
    return cur + Number(next.count);
  }, 0);
  //   const temp10Arr = []
  const sortArr = arr.sort((a, b) => {
    return b.count - a.count;
  });
  const top10FileArr = sortArr.slice(0, 10);
  return {
    // fileCodeLineMap,
    // fileSizeMap,
    totalSize,
    top10FileArr,
    fileCount,
    foderCount,
    fileCommitCountMap,
  };
};
const getRepoCodeLine = async (repoPath) => {
  const cmdStr = `git log  --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }';
    `;
  const res = await excuteCommand(cmdStr, repoPath);
  console.log(res, "res");
};
const getRepoFilesInfo = async (repoPath) => {
  const fileInfo = await traverRepoToGetInfo(repoPath);
  return fileInfo;
  // 仓库的体积计算 done
  // 文件大小前十计算 done
  // 提交次数最多的文件 top 10 done
  // git log --pretty=format: --name-only | sort | uniq -c | sort -rg | head -10
  // 文件的数量 done
  // 文件夹的数量 done
  // 代码行数，代码行数前10 doing
  // https://blog.csdn.net/congqingbin/article/details/78547996
  // 贡献者前五：git log --pretty='%aN' | sort | uniq -c | sort -k1 -n -r | head -n 5
};
const getFileCommitTop10 = async (repoPath) => {
  const cmdStr = "git ls-files";
  const res = await excuteCommand(cmdStr, repoPath);
  const strArr = res.split("\n");
  const filterArr = strArr.filter((path) => {
    return (
      path !== "src/component/special _input/special_input.tsx" &&
      ["ts", "tsx"].includes(path.split(".")[1])
    );
  });
  const fileCommitCountMap = {};
  let cmdStr2 = "";
  let path = "";
  for (let i = 0; i < filterArr.length; i++) {
    path = filterArr[i];
    cmdStr2 = `git log --oneline --no-merges ${path} | wc -l`;
    const countStr = await excuteCommand(cmdStr2, repoPath);
    fileCommitCountMap[path] = countStr.trim();
  }
  const arrObj = Object.keys(fileCommitCountMap).map((path) => {
    if (path) {
      return {
        path: path,
        change_count: +fileCommitCountMap[path],
      };
    }
  });
  const top10Arr = arrObj
    .sort((a, b) => {
      return b.change_count - a.change_count;
    })
    .slice(0, 10);
  return top10Arr;
};
const getFileLineCodeTop10 = async (repoPath) => {
  const cmdStr = "git ls-files";
  const res = await excuteCommand(cmdStr, repoPath);
  const strArr = res.split("\n");
  const filterArr = strArr.filter((path) => {
    return (
      path !== "src/component/special _input/special_input.tsx" &&
      ["ts", "tsx"].includes(path.split(".")[1])
    );
  });
  const fileLineCodeCountMap = {};
  let cmdStr2 = "";
  for (let i = 0; i < filterArr.length; i++) {
    path = filterArr[i];
    cmdStr2 = `cat ${path} | wc -l `;
    if (
      path !== "src/component/special _input/special_input.tsx" &&
      ["ts", "tsx"].includes(path.split(".")[1])
    ) {
      let fileCodeLine = await excuteCommand(cmdStr2, repoPath);
      fileLineCodeCountMap[path] = +fileCodeLine.replace("\\n", "");
    }
  }
  const arrObj = Object.keys(fileLineCodeCountMap).map((path) => {
    if (path) {
      return {
        path: path,
        code_line: +fileLineCodeCountMap[path],
      };
    }
  });
  const top10Arr = arrObj
    .sort((a, b) => {
      return b.code_line - a.code_line;
    })
    .slice(0, 10);
  return top10Arr;
};

module.exports = {
  getRepoFilesInfo,
  getFileCommitTop10,
  getFileLineCodeTop10,
};
