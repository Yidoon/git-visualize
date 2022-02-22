import repoController from '../controller/local/repo-controller'

export default [
  {
    path: '/local/clone',
    method: 'get',
    action: repoController.clone,
  },
  {
    path: '/local/repo',
    method: 'get',
    action: repoController.getRepo,
  },
]
