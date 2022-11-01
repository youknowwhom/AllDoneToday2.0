const express = require('express')
const port = 8000
const app = express()
const bodyParser = require('body-parser')
const { User } = require('./models')

const pinoHttp = require('pino-http')
const pino = require('pino')
const pinoTransports = pino.transport({
    targets: [
        {
            target: 'pino/file',
            options: {
                destination: `log/tmp.log`
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
app.use(pinoHttp({ logger }))

app.use(express.urlencoded({ extend: false }))
app.use(bodyParser.json())

const cors = require('cors')
app.use(cors())

app.post('/api/register', async (req, res) => {
    logger.info(req.body.username)
    const user = await User.findOne({
        where: {
            'username': req.body.username
        }
    })
    if (user) {
        res.json({
            msg: '用户名已存在'
        })
    } else {
        const regUser = await User.create({
            username: req.body.username,
            password: req.body.password,
        })
        res.json({
            regUser,
            msg: '用户已创建'
        })
    }
})

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        where: {
            username: req.body.username
        }
    })
    if (user) {
        if (req.body.password == user.password) {
            let username = user.username.toString()
            user.token = username
            logger.log(user.token)
            user.save()
            res.json({
                user,
                msg: '登陆成功'
            })
        } else {
            res.json({
                msg: '用户密码错误'
            })
        }
    } else {
        res.json({
            msg: '用户名不存在'
        })
    }
})

app.listen(port, () => {
    logger.info(`服务器开始运行: http://127.0.0.1:${port}`)
})