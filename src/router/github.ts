import repoController from '../controller/github/repo-controller'
import contributionController from '../controller/github/contributor-controller'

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
  {
    path: '/github/contributor',
    method: 'get',
    action: contributionController.getContributor,
  },
]
