import { execCommand } from 'src/utils'

const CONFIGS = ['pull.ff only']

const gitConfig = (path: string) => {
  return new Promise(async (resolve, reject) => {
    let cmdStr = ''
    const successs = []
    for (let i = 0, len = CONFIGS.length; i < len; i++) {
      cmdStr = `git config ${CONFIGS[i]}`
      try {
        execCommand(cmdStr, { cwd: path })
        successs.push(CONFIGS[i])
      } catch (e) {
        console.log({ error: e, config: CONFIGS[i] }, 'gitConfig')
      }
    }
    resolve(successs)
  })
}

export default gitConfig
