import { DATA_CACHE_DIR } from '../../config'
import * as fs from 'fs'

const DEFAULT_EMPTY_JSON_STR = JSON.stringify({})
class DataCache {
  private cachePath: string = DATA_CACHE_DIR
  constructor() {}
  get(key?: string) {
    try {
      const jsonStr = fs.readFileSync(this.cachePath)
      const jsonData = JSON.parse(jsonStr.toString() || DEFAULT_EMPTY_JSON_STR)
      return key ? jsonData[key] : jsonData
    } catch (err) {
      console.log(err, '+++')
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
}
export default new DataCache()
