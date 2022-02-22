import repoController from '../controller/github/repo-controller'

export default [
  {
    path: '/github/repo/clone',
    method: 'post',
    action: repoController.clone,
  },
  {
    path: '/github/repo',
    method: 'get',
    action: repoController.getRepo,
  },
]
