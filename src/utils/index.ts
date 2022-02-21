import * as fs from 'fs'

export const getGitProjectNameByUrl = (gitUrl: string) => {
  const gitProjectName = gitUrl.replace(/^.*\/([^/]+)\/?.*$/, '$1')
  return gitProjectName.split('.')[0]
}
export const getGitProjectOwner = (gitUrl: string) => {
  const gitProjectOwner = gitUrl.replace(/^.*\/([^/]+)\/?.*$/, '$1')
}

export const parseGitUrl = (gitUrl: string) => {
  const _isSsh = gitUrl.indexOf('git@') > -1
  const _isHttp = gitUrl.indexOf('http://') > -1 || gitUrl.indexOf('https://') > -1
  const urlType = _isSsh ? 'ssh' : _isHttp ? 'http' : ''
  let projectName: string = ''
  let owner: string = ''
  projectName = gitUrl.replace(/^.*\/([^/]+)\/?.*$/, '$1')
  projectName = projectName.split('.')[0]
  if (urlType === 'ssh') {
    owner = gitUrl.match(/:(.*)\//)[1]
  }
  if (urlType === 'http') {
    owner = gitUrl.match(/https:\/\/github.com\/(.*)\//)[1]
  }
  return {
    project_name: projectName,
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
