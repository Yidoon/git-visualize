import repoController from '../controller/repo-controller'

// export default [...githubRoutes, ...localRoutes]
export default [
  {
    path: '/repo/clone',
    method: 'post',
    action: repoController.clone,
  },
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
    path: '/stats/contributors/trend/code',
    method: 'get',
    action: repoController.getContributorsCommitsCount,
  },
]
