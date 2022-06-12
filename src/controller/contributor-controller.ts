import { getMonthsOfYear, getPathInTmp, getYearUntilNow } from 'src/utils'
import { default as GithubRepoService } from '../service/github/repo-service'
import { default as LocalRepoService } from '../service/local/repo-service'
import * as dayjs from 'dayjs'

class ContributorController {
  private githubRepoService: GithubRepoService = new GithubRepoService()
  private localRepoService: LocalRepoService = new LocalRepoService()

  getContributorsGithub = async (ctx) => {
    const { github_repo_url } = ctx.query
    const data = await this.githubRepoService.getRepoContributor(github_repo_url)
    ctx.body = {
      code: 200,
      msg: '',
      data: data,
    }
  }
  getContributors = async (ctx) => {
    const { github_repo_url, n } = ctx.query

    const path = await getPathInTmp(github_repo_url)
    const data = await this.localRepoService.getRepoContributor(path, {
      withCommitCount: false,
    })
    ctx.body = {
      code: 200,
      msg: '',
      data: data,
    }
  }
  getContributorCommitCount = async (ctx) => {
    const { github_repo_url, contributor, year } = ctx.query
    const path = await getPathInTmp(github_repo_url)
    const repoData = await this.githubRepoService.getRepo(github_repo_url)
    const years = getYearUntilNow(repoData.created_at)
    const res = []
    let timeParams: { after: string; before: string } = { after: '', before: '' }
    let temp
    for (let i = 0; i < years.length; i++) {
      timeParams.after = dayjs.unix(years[i]).startOf('year').format('YYYY-MM-DD')
      timeParams.before = dayjs.unix(years[i]).endOf('year').format('YYYY-MM-DD')

      temp = await this.localRepoService.getRepoCommitCount(path, {
        contributor: contributor,
        ...timeParams,
      })
      res.push({
        date: dayjs.unix(years[i]).startOf('year').format('YYYY'),
        count: temp,
      })
    }
    ctx.body = {
      msg: '',
      data: res,
      code: 200,
    }
  }
  getContributorEachYearCommit = async (ctx) => {
    const { github_repo_url, contributor } = ctx.query
    const path = await getPathInTmp(github_repo_url)
    const repoData = await this.githubRepoService.getRepo(github_repo_url)
    const years = getYearUntilNow(repoData.created_at)
    const res = []
    let timeParams: { after: string; before: string } = { after: '', before: '' }
    let temp
    for (let i = 0; i < years.length; i++) {
      timeParams.after = dayjs.unix(years[i]).startOf('year').format('YYYY-MM-DD')
      timeParams.before = dayjs.unix(years[i]).endOf('year').format('YYYY-MM-DD')

      temp = await this.localRepoService.getRepoCommitCount(path, {
        contributor: contributor,
        ...timeParams,
      })
      res.push({
        year: dayjs.unix(years[i]).startOf('year').format('YYYY'),
        count: temp,
        contributor,
      })
    }
    ctx.body = {
      msg: '',
      data: res,
      code: 200,
    }
  }
  getYearCommit = async (ctx) => {
    const { github_repo_url, contributor, year } = ctx.query
    const path = await getPathInTmp(github_repo_url)
    const res = []
    const months = getMonthsOfYear(year)
    let timeParams: { after: string; before: string } = { after: '', before: '' }
    let temp

    for (let i = 0; i < months.length; i++) {
      timeParams.after = dayjs.unix(months[i]).startOf('month').format('YYYY-MM-DD')
      timeParams.before = dayjs.unix(months[i]).endOf('month').format('YYYY-MM-DD')
      temp = await this.localRepoService.getRepoCommitCount(path, {
        contributor: contributor,
        ...timeParams,
      })
      res.push({
        month: dayjs.unix(months[i]).month() + 1,
        count: temp,
        contributor,
        year: year,
      })
    }
    ctx.body = {
      msg: '',
      data: res,
      code: 200,
    }
  }
  getTimezone = async (ctx) => {
    const { github_repo_url } = ctx.query
    const path = await getPathInTmp(github_repo_url)
    const res = await this.localRepoService.getTimezone(path)
    ctx.body = {
      msg: '',
      data: res,
      code: 200,
    }
  }
  getCodeCount = async (ctx) => {
    const { github_repo_url } = ctx.query
    const path = await getPathInTmp(github_repo_url)
    const arr: any = await this.localRepoService.getRepoContributor(path, {
      top: 5,
      withCommitCount: true,
    })

    const contributors = arr.map((item) => item.contributor)
    const data = {}
    let temp
    let c

    for (let i = 0, len = contributors.length; i < len; i++) {
      c = contributors[i]
      temp = await this.localRepoService.getCodeCount(path, {
        contributor: c,
      })
      data[c] = temp
    }
    ctx.body = {
      msg: '',
      data: data,
      code: 200,
    }
  }
}

export default new ContributorController()
