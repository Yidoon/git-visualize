import { default as GithubRepoService } from '../service/github/repo-service'

class ContributorController {
  private githubRepoService: GithubRepoService = new GithubRepoService()

  getContributors = async (ctx) => {
    const { github_repo_url } = ctx.query
    const data = await this.githubRepoService.getRepo(github_repo_url)
    ctx.body = {
      code: 200,
      msg: '',
      data: data,
    }
  }
}

export default new ContributorController()
