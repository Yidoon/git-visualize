const childProcess = require("child_process");
const process = require("process");
const { chdir } = process;

const excuteCommand = async (command, path) => {
  chdir(path);
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(error, "++++");
        reject();
        return;
      }
      if (stderr) {
        console.log(stderr, "-----");
        reject(stderr);
        return;
      }
      resolve(stdout);
    });
  });
};

module.exports = {
  excuteCommand,
};
