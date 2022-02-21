import homeController from './controller/home-controller'
import repoController from './controller/repo-controller'

export default [
  {
    path: '/',
    method: 'get',
    action: homeController.hello,
  },
  {
    path: '/repo',
    method: 'get',
    action: repoController.getRepo,
  },
]
