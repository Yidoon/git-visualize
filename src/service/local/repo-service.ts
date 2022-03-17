import { chdir } from 'process'
import { exec } from 'child_process'
import { CONTRIBUTOR_ANT_COMMIT_COUNT, TRACKED_FIlES_COUNT } from 'src/commands'

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
  getFileCount = async () => {
    return new Promise((resolve, reject) => {
      exec(TRACKED_FIlES_COUNT, {}, (err, stdout, stderr) => {
        if (err) return reject(err)
        return resolve(stdout)
      })
    })
  }
}
