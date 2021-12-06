const Router = require("koa-router");
const { excuteCommand } = require("../utils");
const router = new Router({
  prefix: "/gv",
});
const CRM_PATH = "/Users/yidoon/Desktop/shifang/crm-fe";
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
  const first_commit_date = await excuteCommand(
    `git log master --pretty='%ad' --date=format:'%Y-%m-%d' | tail -1`,
    CRM_PATH
  );
  try {
    const all_contributers = await excuteCommand(
      ` git shortlog -sn --all`,
      CRM_PATH
    );
    console.log(all_contributers);
  } catch (err) {
    console.log(err);
  }
  ctx.response.body = first_commit_date;
});

// branch
router.get("/branchs", () => {});
router.get("/branchs_local", () => {});
router.get("/branchs_remote", () => {});

// search commit
router.get("/search", () => {});

/**
 * contributors
 * commit statistics of different contributor
 *
 */
router.get("/contributors", () => {});

/**
 * Top 10 contributors
 * Top 10 file size
 * Top 10 documents in terms of lines of code
 * Top 10 most modified documents
 */
router.get("/Statistics", () => {});

/**
 * the keywords of different contributors
 */
router.get("/contributor_keywords", () => {});
/**
 * delete local & remote branch
 */
router.get("branch_delete", () => {});

module.exports = router;
