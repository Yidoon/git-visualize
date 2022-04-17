import { chdir } from 'process'
import { exec } from 'child_process'
import {
  COMMIT_COUNT,
  CONTRIBUTOR_ANT_COMMIT_COUNT,
  TRACKED_FIlES_COUNT,
  CODE_LINES_COUNT,
} from 'src/commands'
import dayjs = require('dayjs')
import {
  execCommand,
  filterFiles,
  getFilesExtensions,
  getStartEndDateOfYear,
} from 'src/utils'
import { EXCLUD_RANK_FILE_NAME_CODE_LINE } from 'src/config'
import { mergeSplitData, splitCommitMsg } from 'src/utils'

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
  getTrackedFiles = async (path?: string) => {
    const cmdStr = `git ls-files`
    return new Promise((resolve, reject) => {
      exec(cmdStr, { cwd: path }, (err, stdout, stderr) => {
        if (err) {
          reject(err)
        } else {
          const arr = (stdout as string).trim().split('\n')
          const res = arr.map((item) => {
            return item.trim()
          })
          resolve(res)
        }
      })
    })
  }

  getRankFileRankOfCodeLine = async (path?: string) => {
    // const cmdStr = `git ls-files | xargs -0  wc -l`
    const trackedFiles = await this.getTrackedFiles(path)
    console.log(trackedFiles, 'trackedFiles')
    const finalFiles = filterFiles(trackedFiles)
    const cmdStr = `echo ${finalFiles.join(' ')} | xargs  wc -l`
    console.log(cmdStr, 'cmdStr1')

    let tempArr
    let resArr = []
    return new Promise((resolve, reject) => {
      exec(cmdStr, { cwd: path }, (err, stdout, stderr) => {
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
          return (
            item.file !== 'total' && !EXCLUD_RANK_FILE_NAME_CODE_LINE.includes(item.file)
          )
        })
        resArr = resArr.sort((a, b) => {
          return b.code_line - a.code_line
        })
        resolve(resArr)
      })
    })
  }
  getFileCategoryChart = async (
    path?: string,
  ): Promise<{ extensions_map: any; total: number }> => {
    const cmdStr = 'git ls-files'
    return new Promise((resolve, reject) => {
      let fileExtension
      let resMap = {}
      exec(cmdStr, { cwd: MockPath }, (err, stdout, stderr) => {
        if (err) {
          reject(err)
        } else {
          const arr = (stdout as string).trim().split('\n')
          arr.forEach((item) => {
            fileExtension = getFilesExtensions(item.trim())
            if (resMap[fileExtension]) {
              resMap[fileExtension] += 1
            } else {
              resMap[fileExtension] = 1
            }
          })
          resolve({
            extensions_map: resMap,
            total: arr.length,
          })
        }
      })
    })
  }
  getWordCloud = async (path?: string, contributor?: string) => {
    const authorStr = contributor ? `--author="${contributor}"` : ''
    const cmdStr = `git log --no-merges ${authorStr} --pretty='%an, %B<gitv />'`
    const authorCommitMsg = {}
    const result = {}
    const pattern = /([^,]+)(.*)/
    const res = await execCommand(cmdStr, { cwd: path })
    const lineData = String(res).split('<gitv />')

    lineData.forEach((line) => {
      line = line.replace(/[\n\r\f]+/, '')
      if (!line) return

      const match = line.match(pattern)
      const author = match[1]
      const msg = match[2].slice(1)

      authorCommitMsg[author] = mergeSplitData(
        authorCommitMsg[author],
        splitCommitMsg(msg),
      )
      authorCommitMsg['all'] = mergeSplitData(authorCommitMsg['all'], splitCommitMsg(msg))
    })
    const authorName = Object.keys(authorCommitMsg)
    authorName.forEach((name) => {
      const mapData = authorCommitMsg[name]
      const sortArray = []

      for (let [name, value] of mapData) {
        sortArray.push({
          name,
          value,
        })
      }

      result[name] = sortArray.sort((a, b) => b.value - a.value).slice(0, 200)
    })
    return result
  }
}
