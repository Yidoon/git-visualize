import { chdir } from 'process'
import { exec } from 'child_process'
import {
  COMMIT_COUNT,
  CONTRIBUTOR_ANT_COMMIT_COUNT,
  TRACKED_FIlES_COUNT,
  CODE_LINES_COUNT,
} from 'src/commands'
import dayjs = require('dayjs')
import { execCommand } from 'src/utils'

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
  getCommitTrend = async (dateRange: string[], path?: string) => {
    let cmdStr = 'git log --pretty=format:"%ad" --date=short'
    return new Promise(async (resolve, reject) => {
      const arr = []
      let startDay, endDay, tempObj
      for (let i = 0, len = dateRange.length; i < len; i++) {
        startDay = dayjs(dateRange[i]).startOf('day').format('YYYY-MM-DD HH:mm')
        endDay = dayjs(dateRange[i]).endOf('day').format('YYYY-MM-DD HH:mm')
        cmdStr = `git log --oneline --after="${startDay}" --before="${endDay}" | wc -l`
        const std = await execCommand(cmdStr, { cwd: path })
        tempObj = {
          date: dateRange[i],
          count: Number((std as string).trim()),
        }
        arr.push(tempObj)
        // exec(cmdStr, { cwd: path }, (err, stdout, stderr) => {
        //   if (err) return reject(err)
        //   console.log({
        //     date: dateRange[i],
        //     count: Number(stdout.trim()),
        //   })

        //   arr.push({
        //     date: dateRange[i],
        //     count: Number(stdout.trim()),
        //   })
        // })
      }
      return resolve(arr)
    })
  }
}
