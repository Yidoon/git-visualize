import { exec } from 'child_process'
import gitConfig from './gitconfig'

const gitPull = async (path: string) => {
  const cmdStr = `git pull`
  await gitConfig(path)
  return new Promise((resolve, reject) => {
    exec(cmdStr, { cwd: path }, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(path)
      }
    })
  })
}
export default gitPull
