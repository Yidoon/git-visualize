import Router = require('koa-router')
import { getRepoCreateTime, initGithubRepo } from '../service'
import { Octokit } from '@octokit/core'
import { parseGitUrl } from 'src/utils'
import * as dayJs from 'dayJs'

const router = new Router({
  prefix: '/gv',
})

router.get('/init', async (ctx, next) => {
  const { github_repo_url } = ctx.query
  if (!github_repo_url) {
    ctx.body = {
      code: 501,
      msg: 'url不能为空',
      data: null,
    }
    return
  }
  const octokit = new Octokit()
  const gitUrlObj = parseGitUrl(github_repo_url as string)
  console.log(gitUrlObj, 'gitUrlObj')

  const res = await octokit.request('GET /repos/{owner}/{repo}', {
    owner: gitUrlObj.owner,
    repo: gitUrlObj.project_name,
  })
  const createDate = dayJs(res.data.created_at).format('YYYY-MM-MM HH:mm:ss')
  ctx.body = {
    code: 200,
    msg: 'success',
    data: res,
  }
  const res1 = await initGithubRepo(github_repo_url as string)
})

router.get('/repos/create_time', async (ctx, next) => {
  const { github_repo_url } = ctx.query
  const res = await getRepoCreateTime(github_repo_url as string)
  console.log(res, 'resss')
  ctx.body = {
    code: 200,
    msg: 'success',
    data: res,
  }
})

export default router
