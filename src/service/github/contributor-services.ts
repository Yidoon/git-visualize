import { chdir, stdout } from 'process'
import { exec } from 'child_process'

export default class ContributorService {
  getContributor = async (repoPath: string) => {
    if (!repoPath) return []
    chdir(repoPath)
    const cmdStr = 'git shortlog -sn --all'
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
}
