import * as dotenv from 'dotenv'

dotenv.config()

const { PORT, DATA_CACHE_DIR, TMP_REPO_DIR } = process.env

const EXCLUD_RANK_FILE_CODE_LINE = [
  'package-lock.json',
  'package.json',
  'yarn.lock',
  'README.md',
  'tsconfig.json',
  'tslint.json',
  '.eslintrc.js',
  '.gitignore',
  '.prettyignore',
  'LICENSE',
  'data/',
  'nodemon.json',
  'ecosystem.config.js',
  '.prettierrc.js',
]

export { EXCLUD_RANK_FILE_CODE_LINE, PORT, DATA_CACHE_DIR, TMP_REPO_DIR }
