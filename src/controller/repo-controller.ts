import { default as GithubRepoService } from '../service/github/repo-service'
import { default as LocalRepoService } from '../service/local/repo-service'
import gitClone from '../lib/git/gitclone'
import { chdir } from 'process'

class RepoController {
  private githubRepoService: GithubRepoService = new GithubRepoService()
  private localRepoService: LocalRepoService = new LocalRepoService()
  getRepo = async (ctx) => {
    const { github_repo_url } = ctx.query
    const data = await this.githubRepoService.getRepo(github_repo_url)
    ctx.body = {
      code: 200,
      msg: 'success',
      data: data,
    }
  }
  clone = async (ctx) => {
    // TODO: local clone use cp command
    const { github_repo_url } = ctx.query
    const path = gitClone(github_repo_url as string)
    ctx.body = {
      code: 200,
      msg: '初始化数据成功',
      data: path,
    }
  }
  getRepoContributor = async (ctx) => {
    const { github_repo_url } = ctx.query
    // github: github api
    const data = await this.githubRepoService.getRepoContributor(github_repo_url)
    // local: need to spec path of repo in local
    // chdir(localRepoPath)
    // const data = await this.localRepoService.getRepoContributor(localRepoPath)
    ctx.body = {
      code: 200,
      msg: '初始化数据成功',
      data: data,
    }
  }
  getFileCount = async (ctx) => {
    const localRepoPath = ''
    chdir(localRepoPath)
    const data = await this.localRepoService.getFileCount()
    ctx.body = {
      code: 200,
      msg: '',
      data: data,
    }
  }
}

export default new RepoController()
