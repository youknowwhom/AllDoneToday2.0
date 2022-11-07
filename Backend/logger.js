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