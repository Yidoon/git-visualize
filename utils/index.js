const childProcess = require("child_process");
const process = require("process");
const stream = require("stream");
const dayjs = require("dayjs");
const { chdir } = process;

const formatStr = "YYYY-MM-DD HH:mm:ss";

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

const getNearlyDays = (day) => {
  const today = dayjs();
  const result = [];
  for (let i = day; i > 0; i--) {
    result.push(today.subtract(i, "day").format("YYYY-MM-DD"));
  }
  return result;
};

const getMonthOfYear = () => {
  const startYear = dayjs().startOf("year").format(formatStr);
  const monthArr = [];
  for (let i = 1; i < 12; i++) {
    let temp = {
      start: dayjs(startYear)
        .add(i, "month")
        .startOf("month")
        .format(formatStr),
      end: dayjs(startYear).add(i, "month").endOf("month").format(formatStr),
    };
    monthArr.push(temp);
  }
  monthArr.unshift({
    start: dayjs(startYear).startOf("month").format(formatStr),
    end: dayjs(startYear).endOf("month").format(formatStr),
  });
  return monthArr;
};

module.exports = {
  excuteCommand,
  createDataParser,
  getNearlyDays,
  getMonthOfYear,
};
