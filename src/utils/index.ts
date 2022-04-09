import * as fs from 'fs'
import {
  EXCLUD_RANK_FILE_NAME_CODE_LINE,
  TMP_REPO_DIR,
  EXCLUD_RANK_FILE_CODE_LINE_EXTENSION,
} from 'src/config'
import gitPull from 'src/lib/git/gitpull'
import gitClone from '../lib/git/gitclone'
import * as dayjs from 'dayjs'
import { exec } from 'child_process'

export const parseGitUrl = (gitUrl: string) => {
  const _isSsh = gitUrl.indexOf('git@') > -1
  const _isHttp = gitUrl.indexOf('http://') > -1 || gitUrl.indexOf('https://') > -1
  const urlType = _isSsh ? 'ssh' : _isHttp ? 'http' : ''
  let repo: string = ''
  let owner: string = ''
  repo = gitUrl.replace(/^.*\/([^/]+)\/?.*$/, '$1')
  repo = repo.split('.')[0]
  if (urlType === 'ssh') {
    owner = gitUrl.match(/:(.*)\//)[1]
  }
  if (urlType === 'http') {
    owner = gitUrl.match(/https:\/\/github.com\/(.*)\//)[1]
  }
  return {
    repo: repo,
    owner: owner,
    protocol: urlType,
    url: gitUrl,
  }
}

export const isFolderExist = (folderPath: string): Promise<boolean> => {
  if (!folderPath) {
    return Promise.resolve(false)
  }
  return new Promise<boolean>((resolve, reject) => {
    fs.stat(folderPath, (err, stats) => {
      if (err) {
        resolve(false)
      } else {
        resolve(stats.isDirectory())
      }
    })
  })
}
/**
 * return repo path in local tmp folder,if not exist,clone it
 * @param githubRepoUrl github repo url
 * @param pull git pull
 * @returns
 */
export const getPathInTmp = async (githubRepoUrl: string, pull = true) => {
  const { repo } = parseGitUrl(githubRepoUrl)
  let targetPath = `${TMP_REPO_DIR}/${repo}`
  console.time('isFolderExist')
  const isExit = await isFolderExist(targetPath)
  console.timeEnd('isFolderExist')
  if (isExit) {
    console.time('git pull')
    if (pull) {
      await gitPull(targetPath)
    }
    console.timeEnd('git pull')
    return targetPath
  } else {
    targetPath = await gitClone(githubRepoUrl)
  }
  return targetPath
}
/**
 * Return the time for each day of the week
 */
export const getEachDayDateUnix = (dateRangeType: 'week' | 'month'): number[] => {
  const dateArr = []
  const DATE_RANGE_COUNT = {
    week: 7,
    month: 30,
  }
  const startOfWeek = dayjs().startOf(dateRangeType)
  for (let i = 0; i < DATE_RANGE_COUNT[dateRangeType]; i++) {
    dateArr.push(startOfWeek.add(i, 'day').unix())
  }
  return dateArr
}
/**
 *
 * @param n
 * @returns the time for each day of last n day
 */
export const getLasyNDayDateUnix = (n: number): number[] => {
  let dateArr = []
  for (let i = n; i >= 0; i--) {
    dateArr.push(dayjs().subtract(i, 'day').unix())
  }
  return dateArr
}
/**
 * wrap exec with promise
 * @param cmd commant
 * @param options exec options
 * @returns
 */
export const execCommand = (cmd: string, options?: any) => {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      }
      resolve(stdout)
    })
  })
}

/**
 * return the start and end date(unix) of spec yaer ,default return current year
 * @param year year
 */
export const getStartEndDateOfYear = (year?: number) => {
  const _year = year || dayjs().year()
  const startDate = dayjs(`${_year}-01-01 00:00:00`).unix()
  const endDate = dayjs(`${_year}-12-31 23:59:59`).unix()
  return {
    startDate,
    endDate,
  }
}

export const filterExcludesFilesByName = (
  source: string[],
  filesName: string[],
): string[] => {
  return source.filter((fileName) => {
    return !filesName.includes(fileName)
  })
}
export const filterExcludesFilesByExtension = (
  source: string[],
  extensions: string[],
): string[] => {
  return source.filter((file) => {
    return !extensions.includes(file.split('.').pop())
  })
}
export const filterFiles = (source) => {
  let resArr = filterExcludesFilesByExtension(
    source,
    EXCLUD_RANK_FILE_CODE_LINE_EXTENSION,
  )
  resArr = filterExcludesFilesByName(resArr, EXCLUD_RANK_FILE_NAME_CODE_LINE)
  return resArr
}
