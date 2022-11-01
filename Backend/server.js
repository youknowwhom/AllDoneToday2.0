import express from 'express'
const port = 8000
const app = express()

/**
 * 解析 JSON 及文本数据
 */
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


/**
 * 允许 CORS
 */
import cors from 'cors'
app.use(cors())


/**
 * 导入 logger
 */
import logger from './logger.js'


/**
 * 导入用户数据数据库
 */
import { UserdataDB, User } from './db/userdata.js'
try {
    await UserdataDB.authenticate()
    logger.info('成功连接到数据库')
} catch (error) {
    logger.error('无法连接到数据库: ', error)
    process.exit(-1)
}


/**
 * 注册 API
 */
app.post('/api/register', async (req, res) => {
    logger.info(req.body)
    res.json(req.body)
})


/**
 * 登录 API
 * 
 * - request
 *   - username: 用户名
 *   - passwordHash: 密码 hash 值
 * 
 * - response
 *   - result: 登录请求结果
 *     - 值只可能为 'success' / 'fail' / 'invalid' 之一
 *   - msg: 服务端返回的信息
 */
app.post('/api/login', async (req, res) => {
    const username = req.body.username
    const passwordHash = req.body.passwordHash
    if (!username || !passwordHash) {
        res.status(400).send({
            result: 'invalid',
            msg: '登录请求格式错误'
        })
        return
    }
    const requestedUser = await User.findOne({
        where: { username: username }
    }) // 由于 username 是 unique 的，所以可以使用 findOne
    if (!requestedUser) {
        res.status(200).send({
            result: 'fail',
            msg: '用户不存在'
        })
        return
    }
    if (requestedUser.passwordHash != passwordHash) {
        res.status(200).send({
            result: 'fail',
            msg: '密码错误'
        })
        return
    }
    res.status(200).send({
        result: 'success',
        msg: '登录成功'
    })
})


/**
 * 运行服务器
 */
app.listen(port, () => {
    logger.info(`服务器开始运行: http://127.0.0.1:${port}`)
})