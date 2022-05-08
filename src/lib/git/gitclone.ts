import { spawn } from 'child_process'
import * as fs from 'fs'
import { parseGitUrl, isFolderExist } from 'src/utils'

const CURRENT_PATH = process.cwd()
const TEP_DIR_NAME = 'tmp'
const TMP_PATH = `${CURRENT_PATH}/${TEP_DIR_NAME}`

const gitClone = async (url: string): Promise<string> => {
  return new Promise(async (resolve, reject): Promise<string> => {
    const { uname } = parseGitUrl(url)
    const isTmpPathExit = await isFolderExist(TMP_PATH)
    if (!isTmpPathExit) {
      fs.mkdirSync(TMP_PATH)
    }
    let targetPath = `${TMP_PATH}/${uname}`

    const isTargetPathExit = await isFolderExist(targetPath)

    if (isTargetPathExit) {
      resolve(targetPath)
      return
    }

    const child = spawn('git', [`clone`, `${url}`, `${uname}`, '--progress'], {
      cwd: TMP_PATH,
    })
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
    child.on('exit', (code) => {
      if (code === 0) {
        console.log('\n clone repository successful.\n')
        console.log(`\n repository path: ${targetPath} \n`)
        resolve(targetPath)
      } else {
        console.log(`\n clone repository failder. error code is ${code}`)
        reject()
      }
    })
  })
}
export default gitClone
