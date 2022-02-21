import gitClone from '../lib/git/gitclone'
import { Octokit } from '@octokit/core'
import { parseGitUrl } from 'src/utils'
import * as dayJs from 'dayJs'

export const initGithubRepo = async (githubRepoUrl: string) => {
  const res = await gitClone(githubRepoUrl)
  return res
}

export const getRepoCreateTime = async (githubRepoUrl: string) => {
  const octokit = new Octokit()
  const gitUrlObj = parseGitUrl(githubRepoUrl as string)
  const res = await octokit.request('GET /repos/{owner}/{repo}', {
    owner: gitUrlObj.owner,
    repo: gitUrlObj.repo,
  })
  const data = {
    create_time: dayJs(res.data.created_at).format('YYYY-MM-MM HH:mm:ss'),
    stargazers_count: res.data.stargazers_count,
    watchers_count: res.data.watchers_count,
    size: res.data.size,
    watchers: res.data.watchers,
    default_branch: res.data.default_branch,
    subscribers_count: res.data.subscribers_count,
  }
  return res
}
