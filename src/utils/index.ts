import * as fs from 'fs'
import { TMP_REPO_DIR } from 'src/config'
import gitPull from 'src/lib/git/gitpull'
import gitClone from '../lib/git/gitclone'

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
 * @returns
 */
export const getPathInTmp = async (githubRepoUrl: string) => {
  const { repo } = parseGitUrl(githubRepoUrl)
  let targetPath = `${TMP_REPO_DIR}/${repo}`
  const isExit = await isFolderExist(targetPath)
  if (isExit) {
    await gitPull(targetPath)
    return targetPath
  } else {
    targetPath = await gitClone(githubRepoUrl)
  }
  return targetPath
}
