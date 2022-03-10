import RepoService from '../../service/github/repo-services'
import gitClone from '../../lib/git/gitclone'

class RepoController {
  private service: RepoService = new RepoService()

  getRepo = async (ctx) => {}
  clone = async (ctx) => {}
}

export default new RepoController()
