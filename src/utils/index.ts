import * as fs from 'fs'

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
