import { parseGitUrl } from 'src/utils'
import RepoService from '../../service/repo-service'
import gitClone from '../../lib/git/gitclone'

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
  clone = async (ctx) => {
    const { github_repo_url } = ctx.query
    const path = gitClone(github_repo_url as string)
    ctx.body = {
      code: 200,
      msg: '初始化数据成功',
      data: path,
    }
  }
}

export default new RepoController()
