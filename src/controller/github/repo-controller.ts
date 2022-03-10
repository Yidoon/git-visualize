import RepoService from '../../service/github/repo-services'
import gitClone from '../../lib/git/gitclone'

class RepoController {
  private service: RepoService = new RepoService()
  getRepo = async (ctx) => {
    const { github_repo_url } = ctx.query
    const data = await this.service.getRepo(github_repo_url)
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
