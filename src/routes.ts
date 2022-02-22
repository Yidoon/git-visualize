import homeController from './controller/home-controller'
import repoController from './controller/repo-controller'

export default [
  {
    path: '/',
    method: 'get',
    action: homeController.hello,
  },
  {
    path: '/github/repo',
    method: 'get',
    action: repoController.getRepo,
  },
  {
    path: '/local/repo',
    method: 'get',
    action: repoController.getRepo,
  },
  {
    path: '/github/temp_clone',
    method: 'get',
    action: repoController.tempClone,
  },
  {
    path: '/test',
    method: 'get',
    action: async (ctx) => {
      ctx.body = {
        code: 200,
        msg: 'success',
        data: 'test',
      }
    },
  },
]
