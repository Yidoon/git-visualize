import { parseGitUrl, getRepoPlatform, isFolderExist } from 'src/utils'
import { CACHE_DIR } from 'src/config'
import * as fs from 'fs'
import * as path from 'path'
import dayjs = require('dayjs')

const DEFAULT_EMPTY_JSON_STR = JSON.stringify({})

class ApiDataDc {
  get(
    url: string,
    api: string,
    timer?: number,
  ): { data: any; updated_time: number; plateform } | boolean {
    const { uname } = parseGitUrl(url)
    const dataFilePath = `${CACHE_DIR}/${uname}/api-data.json`
    if (!isFolderExist(dataFilePath)) return false

    const jsonStr = fs.readFileSync(dataFilePath)
    const jsonData = JSON.parse(jsonStr.toString() || DEFAULT_EMPTY_JSON_STR)
    const apiData = jsonData[api]
    if (!apiData) return false

    if (apiData) {
      const updatedTime = apiData.updated_time
      if (dayjs().unix() - updatedTime > timer) return false
      return apiData
    }
  }

  set(url: string, api: string, data: any): string | boolean {
    const { uname } = parseGitUrl(url)
    const dataFilePath = `${CACHE_DIR}/${uname}/api-data.json`
    const _data = {
      data: data,
      updated_time: dayjs().unix(),
      plateform: getRepoPlatform(url),
    }
    if (!isFolderExist(dataFilePath)) {
      const newData = {}
      fs.mkdirSync(path.dirname(dataFilePath), { recursive: true })
      newData[api] = _data
      fs.writeFileSync(dataFilePath, JSON.stringify(newData))
    } else {
      const originData = fs.readFileSync(dataFilePath)
      originData[api] = _data
      fs.writeFileSync(dataFilePath, JSON.stringify(originData))
    }
    return dataFilePath
  }

  clear(url: string, api: string) {
    const { uname } = parseGitUrl(url)
    const dataFilePath = `${CACHE_DIR}/${uname}/api-data.json`
    if (!isFolderExist(dataFilePath)) return false
    const jsonStr = fs.readFileSync(dataFilePath)
    const jsonData = JSON.parse(jsonStr.toString() || DEFAULT_EMPTY_JSON_STR)
    delete jsonData[api]
    fs.writeFileSync(dataFilePath, JSON.stringify(jsonData))
  }
}
