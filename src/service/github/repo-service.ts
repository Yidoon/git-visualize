import { Octokit } from '@octokit/core'
import { parseGitUrl } from 'src/utils'
import dc from 'src/lib/cache'

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
    const cacheData = dc.get(githubRepoUrl)
    if (cacheData && cache) {
      return cacheData
    } else {
      const res = await this.octokit.request('GET /repos/{owner}/{repo}', {
        owner: owner,
        repo: repo,
      })
      dc.set(githubRepoUrl, res.data)
      return res
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
