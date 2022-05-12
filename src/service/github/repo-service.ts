import { Octokit } from '@octokit/core'
import { parseGitUrl } from 'src/utils'
import dc from 'src/lib/cache'
import apiDataDc from 'src/lib/cache/api-data'
import dayjs = require('dayjs')

export default class RepoService {
  private octokit: Octokit = new Octokit()
  /**
   * Get repo info
   * @param githubRepoUrl Github url
   * @param cache Whether to read information from the cache
   * @returns
   */
  getRepo = async (githubRepoUrl: string, cache = true) => {
    const { owner, repo } = parseGitUrl(githubRepoUrl)
    const cacheData = apiDataDc.get(githubRepoUrl, '/repos/{owner}/{repo}')

    if (cacheData && cache) {
      return cacheData.data
    } else {
      const res = await this.octokit.request('GET /repos/{owner}/{repo}', {
        owner: owner,
        repo: repo,
      })
      apiDataDc.set(githubRepoUrl, '/repos/{owner}/{repo}', res.data)
      return res.data
    }
  }
  getRepoContributor = async (githubRepoUrl: string) => {
    const { owner, repo } = parseGitUrl(githubRepoUrl)
    const res = await this.octokit.request(
      'GET /repos/{owner}/{repo}/contributors?anon=1',
      {
        owner: owner,
        repo: repo,
      },
    )
    return res
  }
}
