import { chdir } from 'process'
import { exec } from 'child_process'
import {
  COMMIT_COUNT,
  CONTRIBUTOR_ANT_COMMIT_COUNT,
  TRACKED_FIlES_COUNT,
  CODE_LINES_COUNT,
} from 'src/commands'
import dayjs = require('dayjs')
import { execCommand, getStartEndDateOfYear } from 'src/utils'
import { EXCLUD_RANK_FILE_CODE_LINE } from 'src/config'

const MockPath = '/Users/yidoon/Desktop/shifang/crm-fe'

export default class RepoService {
  getRepoContributor = async (repoPath: string) => {
    const cmdStr = CONTRIBUTOR_ANT_COMMIT_COUNT
    return new Promise((resolve, reject) => {
      exec(cmdStr, {}, (err, stdout, stderr) => {
        if (err) {
          reject(err)
        } else {
          const str = stdout.trim().replace(/(\d+\t)/g, '')
          const arr = str.split('\n')
          const res = arr.map((item) => item.trim())
          resolve(res)
        }
      })
    })
  }
  getFileCount = async (path?: string) => {
    if (path) {
      chdir(path)
    }
    return new Promise((resolve, reject) => {
      exec(TRACKED_FIlES_COUNT, {}, (err, stdout, stderr) => {
        if (err) return reject(err)
        return resolve(Number(stdout.trim().split('\n')[0]))
      })
    })
  }
  getRepoCommitCount = async (path?: string) => {
    if (path) {
      chdir(path)
    }
    return new Promise((resolve, reject) => {
      exec(COMMIT_COUNT, {}, (err, stdout, stderr) => {
        if (err) return reject(err)
        return resolve(Number(stdout.trim().split('\n')[0]))
      })
    })
  }
  getCodeCount = async (path?: string) => {
    return new Promise((resolve, reject) => {
      exec(CODE_LINES_COUNT, { cwd: path }, (err, stdout, stderr) => {
        if (err) return reject(err)
        const arr = stdout.trim().split(' ')
        const data = {
          total: +arr[0],
          add: +arr[1],
          subs: +arr[2],
        }
        return resolve(data)
      })
    })
  }
  // getCommitTrend = async (dateRange: string[], path?: string) => {
  //   let cmdStr = 'git log --pretty=format:"%ad" --date=short'
  //   return new Promise(async (resolve, reject) => {
  //     const arr = []
  //     let startDay, endDay, tempObj
  //     for (let i = 0, len = dateRange.length; i < len; i++) {
  //       startDay = dayjs(dateRange[i]).startOf('day').format('YYYY-MM-DD HH:mm')
  //       endDay = dayjs(dateRange[i]).endOf('day').format('YYYY-MM-DD HH:mm')
  //       cmdStr = `git log --oneline --after="${startDay}" --before="${endDay}" | wc -l`
  //       const std = await execCommand(cmdStr, { cwd: path })
  //       tempObj = {
  //         date: dateRange[i],
  //         count: Number((std as string).trim()),
  //       }
  //       arr.push(tempObj)
  //     }
  //     return resolve(arr)
  //   })
  // }
  getCommitTrend = async (dateRange: string[], path?: string) => {
    const startDate = `${dateRange[0]} 00:00`
    const endDate = `${dateRange[dateRange.length - 1]} 23:59`
    let cmdStr = `git log --pretty=format:"%cd" --date=format:'%Y-%m-%d' --after="${startDate}" --before="${endDate}"`
    const dateMap = {}
    return new Promise(async (resolve, reject) => {
      const stdout = await execCommand(cmdStr, { cwd: path })
      const arr = (stdout as string).trim().split('\n')
      for (let i = 0, len = arr.length; i < len; i++) {
        const date = arr[i].trim()
        if (!date) continue
        if (dateMap[date]) {
          dateMap[date] += 1
        } else {
          dateMap[date] = 1
        }
      }
      const dateCountArr = dateRange.map((d) => {
        return {
          date: d,
          count: dateMap[d] || 0,
        }
      })
      resolve(dateCountArr)
    })
  }
  getCommitTrendByMonth = async (
    params: { year: number; pickedMonth?: number[] },
    path?: string,
  ) => {
    const { year, pickedMonth } = params
    const DEFAULT_MONTH_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const months: number[] = pickedMonth ? pickedMonth : DEFAULT_MONTH_LIST
    const { startDate, endDate } = getStartEndDateOfYear(year)
    const cmdStr = `git log --pretty=format:"%cd" --date=format:'%m' --after="${startDate}" --before="${endDate}"`
    const dateMap = {}
    return new Promise(async (resolve, reject) => {
      const stdout = await execCommand(cmdStr, { cwd: path })
      const arr = (stdout as string).trim().split('\n')
      for (let i = 0, len = arr.length; i < len; i++) {
        const date = arr[i].trim()
        if (!date) continue
        if (dateMap[date]) {
          dateMap[date] += 1
        } else {
          dateMap[date] = 1
        }
      }
      const monthCountArr = months.map((m) => {
        return {
          mongth: m,
          count: dateMap[m] || 0,
        }
      })
      resolve({
        year,
        list: monthCountArr,
      })
    })
  }
  getContributorsCommits = async (path?: string) => {
    const cmdStr = CONTRIBUTOR_ANT_COMMIT_COUNT
    return new Promise((resolve, reject) => {
      exec(cmdStr, { cwd: MockPath }, (err, stdout, stderr) => {
        if (err) {
          reject(err)
        } else {
          const str = stdout.trim().replace(/(\t)/g, '_')
          const arr = str.split('\n')
          const res = arr.map((item) => {
            const temp = item.trim().split('_')
            return {
              contributor: temp[1],
              commit_count: Number(temp[0]),
            }
          })
          resolve(res)
        }
      })
    })
  }
  getAuthorCommitCount = async (author: string, path?: string) => {
    const cmdStr = `git log --author="${author}" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { print loc,add,subs }'
    `
    return new Promise((resolve, reject) => {
      exec(cmdStr, { cwd: path }, (err, stdout, stderr) => {
        if (err) return reject(err)
        const arr = stdout.trim().split(' ')
        const data = {
          total: +arr[0],
          add: +arr[1],
          subs: +arr[2],
          author,
        }
        return resolve(data)
      })
    })
  }
  getContributorCodeLine = async (path?: string) => {
    const contributors = await this.getRepoContributor(path)
    let resArr = []
    let tempObj
    return new Promise(async (resolve, reject) => {
      try {
        for (let i = 0, len = (contributors as any).length; i < len; i++) {
          tempObj = await this.getAuthorCommitCount(contributors[i], path)
          resArr.push(tempObj)
        }
        resolve(resArr)
      } catch (error) {
        reject(error)
      }
    })
  }
  getRankFileRankOfCodeLine = async (path?: string) => {
    const cmdStr = `git ls-files | xargs wc -l`
    let tempArr
    let resArr = []
    return new Promise((resolve, reject) => {
      exec(cmdStr, { cwd: MockPath }, (err, stdout, stderr) => {
        if (err) return reject(err)
        tempArr = stdout.trim().split('\n')
        resArr = tempArr.map((item) => {
          const temp = item.trim().split(' ')
          return {
            file: temp[1],
            code_line: Number(temp[0]),
          }
        })
        resArr = resArr.filter((item) => {
          return item.file !== 'total' && !EXCLUD_RANK_FILE_CODE_LINE.includes(item.file)
        })
        resArr = resArr.sort((a, b) => {
          return b.code_line - a.code_line
        })
        resolve(resArr)
      })
    })
  }
}
