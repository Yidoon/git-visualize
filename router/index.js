const Router = require("koa-router");
const childProcess = require("child_process");
const {
  branchService,
  contributorService,
  fileService,
  repoService,
  statisticsService,
} = require("../services");
const { excuteCommand } = require("../utils");
const router = new Router({
  prefix: "/gv",
});

const CRM_PATH = "/Users/yidoon/Desktop/shifang/crm-fe";
// const CRM_PATH = "/Users/abc/Desktop/Project/crm-fe";
/**
 * init
 * start with local repo path
 * start with remote repo
 */
router.get("/init", async () => {});

// version
router.get("/version", () => {});
/**
 * info of repo include
 *  run time
 *  Volume of the repo ； foreaach the repo
 *  file's count of repo ; foreach the repo
 *  how many contributors;
 *  local & origin branchs
 **/
router.get("/repo_info", async (ctx) => {
  // get the first commit of repo , [%Y-%m-%d %H:%M:%S]
  let first_commit_date = await excuteCommand(
    `git log master --pretty='%ad' --date=format:'%Y-%m-%d' | tail -1`,
    CRM_PATH
  );
  const contributors = await contributorService.getContributor(CRM_PATH);
  const code_line_number = await repoService.getCodeLineNumOfRepo(CRM_PATH);
  const total_commit_count = contributors.reduce((cur, next) => {
    return cur + Number(next.commit_count);
  }, 0);
  first_commit_date = first_commit_date.replace(/\n/g, "");
  ctx.body = {
    code: "0",
    msg: "",
    data: {
      contributors,
      total_commit_count,
      first_commit_date,
      code_line_number,
    },
  };
});
router.get("/week_commit", async (ctx) => {
  const res = await statisticsService.getWeekCommitView(CRM_PATH);
  ctx.body = {
    code: "0",
    msg: "",
    data: res,
  };
});
router.get("/contributors_data", async (ctx) => {
  const res = await contributorService.getContributorCommitData(CRM_PATH);
  ctx.body = {
    code: 0,
    msg: "",
    data: res,
  };
});
router.get("/commit_by_month", async (ctx) => {
  const query = ctx.query;
  const { contributor } = query;
  const res = await contributorService.getContributorCommitDataByMonth(
    CRM_PATH,
    contributor || undefined
  );
  console.log(res, "commit_by_month");
  ctx.body = {
    code: 0,
    msg: "",
    data: res,
  };
});
// branch
router.get("/branchs", async (ctx) => {
  const res = await branchService.getLocalBranches(CRM_PATH);
  ctx.response.body = res;
});

// search commit
router.get("/search", () => {});

/**
 * contributors
 * commit statistics of different contributor
 *
 */
router.get("/contributors", async (ctx) => {
  const contributors = await contributorService.getContributor(CRM_PATH);
  ctx.body = {
    code: 0,
    msg: "",
    data: contributors,
  };
});

/**
 * Top 10 contributors
 * Top 10 file size
 * Top 10 documents in terms of lines of code
 * Top 10 most modified documents
 */
router.get("/statistics", async (ctx) => {
  const res = await fileService.getRepoFilesInfo(CRM_PATH);
  // console.log(res, 'route-res');
  ctx.response.body = res;
});
router.get("/file_commit_top10", async (ctx) => {
  const res = await fileService.getFileCommitTop10(CRM_PATH);
  ctx.body = {
    code: 0,
    msg: "",
    data: res,
  };
});
router.get("/file_line_code_top10", async (ctx) => {
  const res = await fileService.getFileLineCodeTop10(CRM_PATH);
  ctx.body = {
    code: 0,
    msg: "",
    data: res,
  };
});
router.get("/repo_code_line_number", async (ctx) => {
  const res = await repoService.getCodeLineNumOfRepo(CRM_PATH);
  ctx.response.body = {
    code: res,
  };
});
router.get("/word_could", async (ctx) => {
  const query = ctx.query;
  const { contributor } = query;
  const res = await statisticsService.getWordCloud(CRM_PATH, contributor);
  ctx.body = {
    code: 0,
    msg: "",
    data: res,
  };
});
/**
 * the keywords of different contributors
 */
router.get("/contributor_keywords", () => {});
/**
 * delete local & remote branch
 */
router.get("branch_delete", () => {});

module.exports = router;
