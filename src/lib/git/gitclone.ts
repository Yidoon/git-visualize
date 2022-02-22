import { spawn } from 'child_process'
import * as fs from 'fs'
import { parseGitUrl, isFolderExist } from 'src/utils'

const CURRENT_PATH = process.cwd()
const TEP_DIR_NAME = 'tmp'
const TMP_PATH = `${CURRENT_PATH}/${TEP_DIR_NAME}`

async function gitClone(url: string) {
  return new Promise(async (resolve, reject): Promise<string> => {
    const { repo } = parseGitUrl(url)
    const isTmpPathExit = await isFolderExist(TMP_PATH)
    if (!isTmpPathExit) {
      fs.mkdirSync(TMP_PATH)
    }
    let targetPath = `${TMP_PATH}/${repo}`
    const isTargetPathExit = await isFolderExist(targetPath)
    if (isTargetPathExit) {
      resolve(targetPath)
      return
    }
    const child = spawn('git', ['clone', url, '--progress'], { cwd: TMP_PATH })
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
    child.on('exit', (code) => {
      if (code === 0) {
        console.log('\n clone repository successful.\n')
        console.log(`\n repository path: ${targetPath} \n`)
        resolve(targetPath)
      } else {
        console.log(`\n clone repository failder. error code is ${code}`)
        // 删除临时新建的文件夹
        reject()
      }
    })
  })
}
export default gitClone
