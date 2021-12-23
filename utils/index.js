const childProcess = require("child_process");
const process = require("process");
const stream = require("stream");
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

const createDataParser = (formatCb) => {
  let lastLineData = "";

  let strm = new stream.Transform({
    objectMode: true,

    transform: function (chunk, encoding, cb) {
      let _this = this;
      const s = String(chunk);
      const lines = s.split("\n");
      lastLineData = lines.splice(lines.length - 1, 1)[0];
      lines.forEach(function (l) {
        l && _this.push(l);
      });
      cb();
    },

    flush: function (cb) {
      if (lastLineData) {
        this.push(lastLineData);
      }
      lastLineData = "";
      cb();
    },
  });

  return strm;
};

module.exports = {
  excuteCommand,
  createDataParser,
};
