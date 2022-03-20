import { exec } from 'child_process'

const gitPull = async (path: string) => {
  const cmdStr = `cd ${path} && git pull`
  return new Promise((resolve, reject) => {
    exec(cmdStr, {}, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(path)
      }
    })
  })
}
export default gitPull
