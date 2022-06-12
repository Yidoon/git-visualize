import repoController from '../controller/repo-controller'
import generalController from '../controller/general-controller'
import commitController from '../controller/commit-controller'
import fileController from '../controller/file-controller'
import contributorController from '../controller/contributor-controller'
import commonController from '../controller/common-controller'

// export default [...githubRoutes, ...localRoutes]
export default [
  {
    path: '/common/per_year',
    method: 'get',
    action: commonController.getPerYear,
  },
  {
    path: '/repo/clone',
    method: 'post',
    action: repoController.clone,
  },
  {
    path: '/general',
    method: 'get',
    action: generalController.getGeneralInfo,
  },
  {
    path: '/commit/until_year',
    method: 'get',
    action: commitController.getStartToNowCommitCount,
  },
  {
    path: '/commit/year',
    method: 'get',
    action: commitController.getSpecYearCommitCount,
  },
  {
    path: '/commit/commit_count',
    method: 'get',
    action: contributorController.getContributorCommitCount,
  },
  {
    path: '/file/catrgory',
    method: 'get',
    action: fileController.getFileCategory,
  },
  // Lists contributors to the specified repository and sorts them by the number of commits per contributor in descending order.
  {
    path: '/contributor/github',
    method: 'get',
    action: contributorController.getContributorsGithub,
  },
  // get contributors in local repositories
  {
    path: '/contributor/local',
    method: 'get',
    action: repoController.getRepoContributor,
  },
  {
    path: '/contributors/local',
    method: 'get',
    action: contributorController.getContributors,
  },
  // list contributor commit count in each year
  {
    path: '/contributor/each_year_commit',
    method: 'get',
    action: contributorController.getContributorEachYearCommit,
  },
  {
    path: '/contributor/year_commit',
    method: 'get',
    action: contributorController.getYearCommit,
  },
  {
    path: '/contributor/timezone',
    method: 'get',
    action: contributorController.getTimezone,
  },
  {
    path: '/contributor/code_count',
    method: 'get',
    action: contributorController.getCodeCount,
  },
  //------ need to rewrite below ----------
  {
    path: '/repo/info',
    method: 'get',
    action: repoController.getRepo,
  },
  {
    path: '/repo/contributor',
    method: 'get',
    action: repoController.getRepoContributor,
  },
  {
    path: '/repo/file/count',
    method: 'get',
    action: repoController.getFileCount,
  },
  {
    path: '/repo/commit/count',
    method: 'get',
    action: repoController.getCommitCount,
  },
  {
    path: '/repo/code/count',
    method: 'get',
    action: repoController.getCodeCount,
  },
  {
    path: '/stats/commit/trend',
    method: 'get',
    action: repoController.getCommitTrend,
  },
  {
    path: '/stats/commit/trend/month',
    method: 'get',
    action: repoController.getCommitTrendByMonth,
  },
  {
    path: '/stats/commit/trend/contributors',
    method: 'get',
    action: repoController.getContributorsCommitsCount,
  },
  {
    path: '/stats/contributors/trend/code/line',
    method: 'get',
    action: repoController.getContributorCodeLine,
  },
  {
    path: '/rank/file/code_line',
    method: 'get',
    action: repoController.getRankFileRankOfCodeLine,
  },
  {
    path: '/chart/file_category',
    method: 'get',
    action: repoController.getFileCategoryChart,
  },
  {
    path: '/word_cloud',
    method: 'get',
    action: repoController.getWordCloud,
  },
]
