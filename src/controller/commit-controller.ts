import { default as LocalRepoService } from '../service/local/repo-service'
import { default as GithubRepoService } from '../service/github/repo-service'
import { getPathInTmp, getYearUntilNow } from 'src/utils'
import dayjs = require('dayjs')

class CommitController {
  private localRepoService: LocalRepoService = new LocalRepoService()
  private githubRepoService: GithubRepoService = new GithubRepoService()

  /**
   * Get the number of commits per year
   * @param ctx
   */
  getStartToNowCommitCount = async (ctx) => {
    const { github_repo_url } = ctx.query
    const data = await this.githubRepoService.getRepo(github_repo_url)
    const path = await getPathInTmp(github_repo_url)
    const createAt = data.created_at
    const years = getYearUntilNow(createAt)

    const res = []
    let temp
    let params: { after: string; before: string } = { after: '', before: '' }
    for (let i = 0; i < years.length; i++) {
      params.after = dayjs.unix(years[i]).startOf('year').format('YYYY-MM-DD')
      params.before = dayjs.unix(years[i]).endOf('year').format('YYYY-MM-DD')

      temp = await this.localRepoService.getRepoCommitCount(path, params)
      res.push({
        date: dayjs.unix(years[i]).startOf('year').format('YYYY'),
        count: temp,
      })
    }
    res.sort((a, b) => {
      return b.count - a.count
    })
    ctx.body = {
      code: 200,
      msg: '',
      data: res,
    }
  }
  getSpecYearCommitCount = async (ctx) => {
    const { github_repo_url, year } = ctx.query
    if (!year) {
      ctx.body = {
        code: 200,
        msg: '缺少年份',
        data: null,
      }
    }
    const path = await getPathInTmp(github_repo_url)
    const startMonth = dayjs().year(year).startOf('year').format('YYYY-MM-DD')

    let params: { after: string; before: string } = { after: '', before: '' }
    let temp
    let baseMonth
    const res = []
    for (let i = 0; i < 12; i++) {
      baseMonth = dayjs(startMonth).add(i, 'month')
      params.after = baseMonth.startOf('month').format('YYYY-MM-DD')
      params.before = baseMonth.endOf('month').format('YYYY-MM-DD')
      temp = await this.localRepoService.getRepoCommitCount(path, params)
      res.push({
        date: baseMonth.month() + 1,
        count: temp,
      })
    }
    ctx.body = {
      code: 200,
      msg: '',
      data: res,
    }
  }
}

export default new CommitController()
