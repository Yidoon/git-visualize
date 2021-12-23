const childProcess = require("child_process");
const { createDataParser } = require("../utils");
/**
 * contributors and theirs commits
 * @returns 
 */
const getContributor = async () => {
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

module.exports = {
  getContributor,
};
