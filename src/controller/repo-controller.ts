import { default as GithubRepoService } from '../service/github/repo-service'
import { default as LocalRepoService } from '../service/local/repo-service'
import gitClone from '../lib/git/gitclone'
import { chdir } from 'process'
import { parseGitUrl, getPathInTmp } from 'src/utils'
import { getEachDayDateUnix, getLasyNDayDateUnix } from 'src/utils'
import dayjs = require('dayjs')

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
    const path = await gitClone(github_repo_url as string)
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
    // TODO:
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
    const { github_repo_url } = ctx.query
    const path = await getPathInTmp(github_repo_url)
    const data = await this.localRepoService.getFileCount(path)
    ctx.body = {
      code: 200,
      msg: '',
      data: data,
    }
  }
  getCommitCount = async (ctx) => {
    const { github_repo_url } = ctx.query
    const path = await getPathInTmp(github_repo_url)
    const data = await this.localRepoService.getRepoCommitCount(path)
    ctx.body = {
      code: 200,
      msg: '',
      data: data,
    }
  }
  getCodeCount = async (ctx) => {
    const { github_repo_url } = ctx.query
    const path = await getPathInTmp(github_repo_url)
    const codeLineCount = await this.localRepoService.getCodeCount(path)
    ctx.body = {
      code: 200,
      msg: '',
      data: codeLineCount,
    }
  }
  getCommitTrend = async (ctx) => {
    const { last_n_day, date_range_type, github_repo_url } = ctx.query
    const path = await getPathInTmp(github_repo_url)
    if (!last_n_day && !date_range_type) {
      ctx.body = {
        code: 20001,
        msg: '缺少参数 last_n_day',
        data: '',
      }
      return
    }
    let dateArr
    if (last_n_day) {
      dateArr = getLasyNDayDateUnix(last_n_day).map((d: number) => {
        return dayjs.unix(d).format('YYYY-MM-DD')
      })
    } else {
      dateArr = getEachDayDateUnix(date_range_type).map((d: number) => {
        return dayjs.unix(d).format('YYYY-MM-DD')
      })
    }
    const res = await this.localRepoService.getCommitTrend(dateArr, path)
    ctx.body = {
      code: 200,
      msg: '',
      data: res,
    }
  }
}

export default new RepoController()
