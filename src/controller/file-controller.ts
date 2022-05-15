import { getPathInTmp } from 'src/utils'
import { default as LocalRepoService } from '../service/local/repo-service'

class FileController {
  private localRepoService: LocalRepoService = new LocalRepoService()
  getFileCategory = async (ctx) => {
    const { github_repo_url } = ctx.query
    const path = await getPathInTmp(github_repo_url)
    const data = await this.localRepoService.getFileCategoryChart(path)
    ctx.body = {
      code: 200,
      msg: '',
      data: data,
    }
  }
}

export default new FileController()
