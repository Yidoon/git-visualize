import * as dayjs from 'dayjs'
import { calcRepoAge, getPathInTmp } from 'src/utils'
import { default as GithubRepoService } from '../service/github/repo-service'
import { default as LocalRepoService } from '../service/local/repo-service'

class GeneralController {
  private githubRepoService: GithubRepoService = new GithubRepoService()
  private localRepoService: LocalRepoService = new LocalRepoService()

  getGeneralInfo = async (ctx) => {
    const { github_repo_url } = ctx.query
    try {
      const data = await this.githubRepoService.getRepo(github_repo_url)
      const path = await getPathInTmp(github_repo_url)
      // TODO: too slow
      const codeCount = await this.localRepoService.getCodeCount(path)
      const fileCount = await this.localRepoService.getFileCount(path)
      const contributors = await this.localRepoService.getRepoContributor(path)
      const commitCount = await this.localRepoService.getRepoCommitCount(path)
      const returnData = {
        name: data.name,
        age: calcRepoAge(data.created_at),
        created_at: dayjs(data.created_at).format('YYYY-MM-DD hh:mm:ss'),
        star: data.stargazers_count,
        license: data.license ? data.license.name : '',
        code_count: codeCount,
        file_count: fileCount,
        contributor_count: contributors.length,
        volume: `${(data.size / 1024).toFixed(2)} MB`,
        commit_count: commitCount,
        _collected_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }
      ctx.body = {
        code: 200,
        msg: 'success',
        data: returnData,
      }
    } catch (err) {
      console.log(err, 'getGeneralInfo-error')
    }
  }
}

export default new GeneralController()
