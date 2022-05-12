import { CACHE_DIR } from 'src/config'
import { getRepoPlatform, isFileExist, parseGitUrl } from 'src/utils'
import * as fs from 'fs'
import * as dayjs from 'dayjs'
import * as path from 'path'

const DEFAULT_EMPTY_JSON_STR = JSON.stringify({})
class LatestPull {
  get(url: string, timer?: number) {
    const { uname } = parseGitUrl(url)
    const dataFilePath = `${CACHE_DIR}/${uname}/latest_pull.json`
    if (!isFileExist(dataFilePath)) return undefined
    const jsonStr = fs.readFileSync(dataFilePath)
    const jsonData = JSON.parse(jsonStr.toString() || DEFAULT_EMPTY_JSON_STR)
    return jsonData
  }
  refresh(url: string) {
    const { uname } = parseGitUrl(url)
    const dataFilePath = `${CACHE_DIR}/${uname}/latest_pull.json`
    const data = {
      updated_time: dayjs().unix(),
      plateform: getRepoPlatform(url),
    }
    if (!isFileExist(dataFilePath)) {
      fs.mkdirSync(path.dirname(dataFilePath), { recursive: true })
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data))
  }
}

export default new LatestPull()
