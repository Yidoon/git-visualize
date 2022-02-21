import { parseGitUrl } from 'src/utils'
import RepoService from '../service/repo-service'

class RepoController {
  private service: RepoService = new RepoService()

  getRepo = async (ctx) => {
    const { github_repo_url } = ctx.query
    const { owner, repo } = parseGitUrl(github_repo_url as string)
    const res = await this.service.getRepo({ owner, repo })
    ctx.body = {
      code: 200,
      msg: 'success',
      data: res,
    }
  }
}

export default new RepoController()
