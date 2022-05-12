import { parseGitUrl, getRepoPlatform, isFileExist } from 'src/utils'
import { CACHE_DIR } from 'src/config'
import * as fs from 'fs'
import * as path from 'path'
import dayjs = require('dayjs')

const DEFAULT_EMPTY_JSON_STR = JSON.stringify({})
const DEFAULT_INTERVAL_TO_REFRESH_CACHE = 60 * 1000 * 60 * 24

class ApiDataDc {
  get(
    url: string,
    api: string,
    timer?: number,
  ): { data: any; updated_time: number; plateform } | null {
    const { uname } = parseGitUrl(url)
    const dataFilePath = `${CACHE_DIR}/${uname}/api-data.json`

    if (!isFileExist(dataFilePath)) return null
    const jsonStr = fs.readFileSync(dataFilePath)
    const jsonData = JSON.parse(jsonStr.toString() || DEFAULT_EMPTY_JSON_STR)
    const apiData = jsonData[api]
    if (!apiData) return null
    const _timer = timer || DEFAULT_INTERVAL_TO_REFRESH_CACHE
    if (apiData) {
      const updatedTime = apiData.updated_time
      if (dayjs().unix() - updatedTime > _timer) return null
      return apiData
    }
  }

  set(url: string, api: string, data: any): string {
    const { uname } = parseGitUrl(url)
    const dataFilePath = `${CACHE_DIR}/${uname}/api-data.json`
    const _data = {
      data: data,
      updated_time: dayjs().unix(),
      plateform: getRepoPlatform(url),
    }
    if (!isFileExist(dataFilePath)) {
      const newData = {}
      fs.mkdirSync(path.dirname(dataFilePath), { recursive: true })
      newData[api] = _data
      fs.writeFileSync(dataFilePath, JSON.stringify(newData))
    } else {
      const originData = JSON.parse(fs.readFileSync(dataFilePath).toString())
      originData[api] = _data
      fs.writeFileSync(dataFilePath, JSON.stringify(originData))
    }
    return dataFilePath
  }

  clear(url: string, api: string) {
    const { uname } = parseGitUrl(url)
    const dataFilePath = `${CACHE_DIR}/${uname}/api-data.json`
    if (!isFileExist(dataFilePath)) return false
    const jsonStr = fs.readFileSync(dataFilePath)
    const jsonData = JSON.parse(jsonStr.toString() || DEFAULT_EMPTY_JSON_STR)
    delete jsonData[api]
    fs.writeFileSync(dataFilePath, JSON.stringify(jsonData))
  }
}

export default new ApiDataDc()
