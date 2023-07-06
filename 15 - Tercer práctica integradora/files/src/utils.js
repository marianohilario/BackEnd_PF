import {fileURLToPath} from 'url'
import { dirname } from 'path'
import logger from './ultis/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
logger.info('__dirname', __dirname);

export default __dirname