import { parseGitUrl } from 'src/utils'
import RepoService from '../service/repo-service'
import gitClone from '../lib/git/gitclone'

class RepoController {
  private service: RepoService = new RepoService()

  getRepo = async (ctx) => {
    const { github_repo_url } = ctx.query
    const { owner, repo } = parseGitUrl(github_repo_url as string)
    const data = await this.service.getRepo({ owner, repo })
    ctx.body = {
      code: 200,
      msg: 'success',
      data: data,
    }
  }
  tempClone = async (ctx) => {
    const { github_repo_url } = ctx.query
    const res = await gitClone(github_repo_url as string)
    return res
  }
}

export default new RepoController()
