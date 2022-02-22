import { Octokit } from '@octokit/core'

export default class RepoService {
  private octokit: Octokit = new Octokit()

  getRepo = async (params: { owner: string; repo: string }) => {
    const { owner, repo } = params
    const res = await this.octokit.request('GET /repos/{owner}/{repo}', {
      owner: owner,
      repo: repo,
    })
    return res
  }
}
