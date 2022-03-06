import ContributorService from 'src/service/github/contributor-services'
import { isFolderExist, parseGitUrl } from 'src/utils'

const CURRENT_PATH = process.cwd()
const TEP_DIR_NAME = 'tmp'
const TMP_PATH = `${CURRENT_PATH}/${TEP_DIR_NAME}`

class ContributorController {
  private service: ContributorService = new ContributorService()
  getContributor = async (ctx) => {
    const { github_repo_url } = ctx.query
    const { repo } = parseGitUrl(github_repo_url)
    let targetPath = `${TMP_PATH}/${repo}`
    const isTargetPathExit = await isFolderExist(targetPath)
    if (isTargetPathExit) {
      const res = await this.service.getContributor(targetPath)
      ctx.body = {
        code: 200,
        msg: '',
        data: res,
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '仓库还未初始化',
        data: null,
      }
    }
  }
}

export default new ContributorController()
