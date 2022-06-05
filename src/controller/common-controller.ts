import { getYearUntilNow } from 'src/utils'
import { default as GithubRepoService } from '../service/github/repo-service'

class commonController {
  private githubRepoService: GithubRepoService = new GithubRepoService()

  /**
   * return year count from start to now
   */
  getPerYear = async (ctx) => {
    const { github_repo_url } = ctx.query
    try {
      const data = await this.githubRepoService.getRepo(github_repo_url)
      const years = getYearUntilNow(data.created_at)
      ctx.body = {
        code: 200,
        msg: '',
        data: years,
      }
    } catch (err) {
      console.log(err, 'getYears-error')
    }
  }
}

export default new commonController()
