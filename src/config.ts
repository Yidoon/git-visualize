import * as dotenv from 'dotenv'

dotenv.config()

export const { PORT, DATA_CACHE_DIR, TMP_REPO_DIR } = process.env
