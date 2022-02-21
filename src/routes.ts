import homeController from './controller/home-controller'

export default [
  {
    path: '/',
    method: 'get',
    action: homeController.hello,
  },
  {
    path: '/init_project',
    method: 'get',
    action: homeController.hello,
  },
]
