/**
 * 如果 log 文件夹不存在，则新建之
 */
import fs from 'fs/promises'

await (async function() {
    try {
        await fs.access('log')
        console.log('日志文件夹已经存在。')
    } catch (err) {
        await fs.mkdir('log')
        console.log('日志文件夹不存在，已经新建。')
    }
})()

/**
 * 设置 logger
 */
import pino from 'pino'
const pinoTransports = pino.transport({
    targets: [
        {
            target: 'pino/file',
            options: {
                destination: 'log/tmp.log'
            }
        },
        {
            target: 'pino-pretty',
            options: {
                destination: 1
            }
        }
    ]
})
const logger = pino(pinoTransports)

export default logger