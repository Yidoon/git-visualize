import { DATA_CACHE_DIR } from '../../config'
import * as fs from 'fs'
import dayjs = require('dayjs')

const DEFAULT_EMPTY_JSON_STR = JSON.stringify({})
const DEFAULT_INTERVAL_TO_REFRESH_CACHE = 60 * 1000 * 60 * 24
class DataCache {
  private cachePath: string = DATA_CACHE_DIR
  constructor() {}
  get(key?: string) {
    try {
      const jsonStr = fs.readFileSync(this.cachePath)
      const jsonData = JSON.parse(jsonStr.toString() || DEFAULT_EMPTY_JSON_STR)
      return key ? jsonData[key] : jsonData
    } catch (err) {
      console.log(err, 'cache-get-error')
    }
  }
  set(key, value) {
    const allData = this.get()
    allData[key] = value
    fs.writeFileSync(this.cachePath, JSON.stringify(allData))
    return this.cachePath
  }
  delete(key) {
    const allData = this.get()
    delete allData[key]
    fs.writeFileSync(this.cachePath, JSON.stringify(allData))
  }
  clear() {
    fs.writeFileSync(this.cachePath, DEFAULT_EMPTY_JSON_STR)
  }
  /**
   * Determine if the cache is need to refresh
   * @param latestModifiedUnix
   * @returns
   */
  isCacheNeedUpdate(githubRepoUrl: string) {
    const cacheData = this.get(githubRepoUrl)
    return dayjs().unix() - cacheData._latest_modified > DEFAULT_INTERVAL_TO_REFRESH_CACHE
  }
}
export default new DataCache()
