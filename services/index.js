const branchService = require("./branch");
const contributorService = require("./contributor");
const fileService = require("./file");
const repoService = require("./repo");
const statisticsService = require("./statistics");
const reportService = require('./report')

module.exports = {
  branchService,
  contributorService,
  fileService,
  repoService,
  statisticsService,
  reportService
};
