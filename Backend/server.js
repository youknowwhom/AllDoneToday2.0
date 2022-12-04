import express from 'express'
import jwt from 'jsonwebtoken'
let jwtKey = 'ToDoList_Backend_JSONWebToken_Key_JustForTesting_20221121'
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

import fs from 'fs/promises'
const serverConfig = JSON.parse(await fs.readFile('./serverConfig.json', { encoding: 'utf-8' }))

logger.info('读取到服务器配置：')
logger.info(serverConfig)


/**
 * 导入数据库
 */
import { UserdataDB, User } from './db/userdata.js'
import { EventDB, Event } from './db/event.js'
import { EmailVerifySessionDB, EmailVerifySession } from './db/email.js'
import { Op } from 'sequelize'
try {
    await UserdataDB.authenticate()
    await EventDB.authenticate()
    await EmailVerifySessionDB.authenticate()
    logger.info('成功连接到数据库')
} catch (error) {
    logger.error('无法连接到数据库: ', error)
    process.exit(-1)
}

const verificationInterval = 60
const verificationExpire = 10 * 60

const RemoveExpiredEmailVerifySession = async () => {
    await EmailVerifySession.destroy({
        where: {
            createdAt: {
                [Op.lt]: new Date() - verificationExpire * 1000,
            }
        }
    })
}

import nodemailer from 'nodemailer'


const verificationMailer = nodemailer.createTransport({
    service: '163',
    auth: serverConfig.mailer,
})

app.post('/api/user/sendVerificationCode', async (req, res) => {
    const GenerateCode = async () => {
        const Generate = () => {
            const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
            let str = ''
            for (let i = 0; i < 5; i++) {
                str += charset.charAt(Math.floor(Math.random() * charset.length))
            }
            return str
        }
        let code = Generate()
        logger.info(`生成验证码：${code}`)
        while (await EmailVerifySession.findOne({ where: { code: code } })) {
            code = Generate()
            logger.info(`重复，生成新的验证码：${code}`)
        }
        return code
    }

    logger.info(req.body)

    let email
    try {
        email = req.body.email
    } catch (err) {
        res.status(400).send({
            type: 'invalid',
            msg: '电子邮箱地址无效',
        })
        return
    }

    if (!email) {
        res.status(400).send({
            type: 'invalid',
            msg: '电子邮箱地址无效',
        })
        return
    }

    logger.info(`收到向 ${email} 发送验证码的请求`)

    await RemoveExpiredEmailVerifySession()

    for (let s of await EmailVerifySession.findAll({
        where: {
            email: email,
        }
    })) {
        logger.info(`${s.email} 的暂时还有效的验证码： ${s.code} （${s.createdAt}）`)
    }

    let lastSend = await EmailVerifySession.max('createdAt', { where: { email: email } })

    logger.info(`上一条验证码在 ${lastSend} 发出`)

    if (lastSend > new Date() - verificationInterval * 1000) {
        logger.info(`上一条在 ${verificationInterval} 秒内发出，取消发送`)
        res.status(400).send({
            type: 'cooldown',
            cd: verificationInterval - (new Date() - lastSend) / 1000,
        })
        return
    }

    try {
        const code = await GenerateCode()

        logger.info(`即将发出验证码 ${code} 给 ${email}`)

        await verificationMailer.sendMail({
            from: {
                name: '今日毕',
                address: serverConfig.mailer.user,
            },
            to: email,
            subject: '今日毕 - 您的邮箱验证码',
            text: `您的邮箱验证码为：\n${code}\n此验证码 ${Math.round(verificationExpire / 60)} 分钟内有效`
        })

        await EmailVerifySession.create({
            email: email,
            code: code
        })

        logger.info(`已经发送验证码 ${code} 给 ${email}`)
    } catch (err) {
        logger.error(err)
        res.status(400).send({
            type: 'error',
            msg: '服务器故障',
        })
        return
    }

    res.sendStatus(200)
})

/**
 * 注册 API
 * - request
 *  - username: 用户名
 *  - passwordHash: 密码Hash
 *  - EmailAddress: 邮箱地址
 *  - VerificationCode: 验证码
 * - response
 *  - msg: 后端返回给前端的信息
 */
app.post('/api/user/signup', async (req, res) => {
    const username = req.body.UserName
    const PasswordHash = req.body.PasswordHash
    const EmailAddress = req.body.EmailAddress
    const VerificationCode = req.body.VerificationCode

    if (!username) {
        res.status(400).send({ msg: '未填写用户名' })
        return
    }

    if (!PasswordHash) {
        res.status(400).send({ msg: '未填写密码' })
        return
    }

    if (!EmailAddress) {
        res.status(400).send({ msg: '未填写电子邮箱地址' })
        return
    }

    if (!VerificationCode) {
        res.status(400).send({ msg: '验证码为空' })
        return
    }

    if (await User.findOne({ where: { username: username } })) {
        res.status(400).send({ msg: '该用户名已被使用' })
        return
    }

    if (await User.findOne({ where: { EmailAddress: EmailAddress } })) {
        res.status(400).send({ msg: '该邮箱已被使用' })
        return
    }

    await RemoveExpiredEmailVerifySession()

    if (!await EmailVerifySession.findOne({ where: { email: EmailAddress, code: VerificationCode } })) {
        res.status(400).send({ msg: '验证码错误或已失效' })
        return
    }

    let newUser = User.build({
        username: username,
        passwordHash: PasswordHash,
        EmailAddress: EmailAddress
    })

    await newUser.save()

    res.status(200).send({
        msg: '注册成功'
    })

    return
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
app.post('/api/user/signin', async (req, res) => {
    const username = req.body.username
    const passwordHash = req.body.passwordHash
    if (!username || !passwordHash) {
        res.status(400).send({
            result: 'fail',
            msg: '用户名或密码为空'
        })
        return
    }
    const requestedUser = await User.findOne({
        where: { username: username }
    }) // 由于 username 是 unique 的，所以可以使用 findOne
    if (!requestedUser) {
        res.status(400).send({
            result: 'fail',
            msg: '用户名或密码错误'
        })
        return
    }
    if (requestedUser.passwordHash != passwordHash) {
        res.status(400).send({
            result: 'fail',
            msg: '用户名或密码错误'
        })
        return
    }
    let jwtBody = {
        username: requestedUser.username,
    }
    let token = jwt.sign(jwtBody, jwtKey, {
        expiresIn: '30d'
    })
    logger.info(token)
    res.status(200).send({
        result: 'success',
        msg: '登录成功',
        token: token
    })
})


/**
 * 重置密码
 *  - request
 *   - EmailAddress: 邮箱地址
 *   - VerificationCode: 验证码
 *   - PasswordHash: 修改好的密码
 *  - respond:
 *   - msg: 服务端返回的信息
 */
app.post('/api/user/resetPassword', async (req, res) => {
    const username = req.body.UserName
    const PasswordHash = req.body.PasswordHash
    const EmailAddress = req.body.EmailAddress
    const VerificationCode = req.body.VerificationCode

    if (!username) {
        res.status(400).send({ msg: '未填写用户名' })
        return
    }

    if (!PasswordHash) {
        res.status(400).send({ msg: '未填写密码' })
        return
    }

    if (!EmailAddress) {
        res.status(400).send({ msg: '未填写电子邮箱地址' })
        return
    }

    if (!VerificationCode) {
        res.status(400).send({ msg: '验证码为空' })
        return
    }

    let targetUser = await User.findOne({ where: { username: username } })

    if (!targetUser) {
        res.status(400).send({ msg: '用户不存在' })
        return
    }

    if (targetUser.EmailAddress != EmailAddress) {
        res.status(400).send({ msg: '邮箱不正确' })
        return
    }

    await RemoveExpiredEmailVerifySession()

    if (!await EmailVerifySession.findOne({ where: { email: EmailAddress, code: VerificationCode } })) {
        res.status(400).send({ msg: '验证码错误或已失效' })
        return
    }

    try {
        await User.update({ PasswordHash: PasswordHash }, { where: { username: username } })
    } catch (err) {
        res.status(400).send({
            msg: '未知错误'
        })
        return
    }

    res.status(200).send({
        msg: '重置密码成功'
    })
})

/**
 * 获取个人信息 api:
 *   - request:
 *     - token: token
 *   - response(success):
 *     - 用户的个人信息，具体内容见 UserInfo.md
 *   - response(failure):
 *     - msg: 后端返回给前端的错误信息，为 'invalid' / 'expired' 之一
 */
app.post('/api/user/getInfo', async (req, res) => {
    if (!req.body.token) {
        res.status(400).send({
            msg: 'invalid'
        })
        return
    }

    let userName = ''
    try {
        userName = jwt.verify(req.body.token, jwtKey).username
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(400).send({
                msg: 'expired'
            })
        } else {
            logger.info(err)
            res.status(400).send({
                msg: 'invalid'
            })
        }
        return
    }

    // 数据库中查找 username

    const UserObj = await User.findOne({
        where: {
            username: userName
        }
    })

    if (!UserObj) {
        res.status(400).send({
            msg: 'invalid'
        })
    }

    res.status(200).send({
        UserName: UserObj.username,
        EmailAddress: UserObj.EmailAddress,
        UserGender: UserObj.UserGender,
        Signature: UserObj.Signature,
        Birthday: UserObj.Birthday,
        msg: '个人信息'
    })

})

app.post('/api/user/verifyToken', async (req, res) => {
    if (!req.body.token) {
        res.sendStatus(400)
        logger.info('校验 token 失败')
        return
    }

    let userName
    try {
        userName = jwt.verify(req.body.token, jwtKey).username
    } catch (err) {
        res.sendStatus(400)
        logger.info('校验 token 失败')
        return
    }

    // 数据库中查找 username

    const UserObj = await User.findOne({
        where: {
            username: userName
        }
    })

    if (!UserObj) {
        res.sendStatus(400)
        logger.info('校验 token 失败')
    }

    logger.info(`用户#${userName} 校验 token 成功`)

    res.sendStatus(200)
})

/**
 * 修改个人信息的api
 *  - request
 *    - token : token
 *    - 修改的数据包
 *  - response
 *    - 修改的数据是否成功
 *      - bool 变量解决对应的问题：
 *      - UserChangeGender,UserChangeSignature,UserChangeBirthday
 *      - UserChangePhoto(没写)
 */

app.post('/api/user/updateInfo', async (req, res) => {
    if (!req.body.token) {
        res.status(400).send({
            msg: 'invalid'
        })
        return
    }

    let userName = ''
    try {
        userName = jwt.verify(req.body.token, jwtKey).username
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(400).send({
                msg: 'expired'
            })
        } else {
            logger.info(err)
            res.status(400).send({
                msg: 'invalid'
            })
        }
        return
    }

    const UserObj = await User.findOne({
        where: {
            username: userName
        }
    })

    if (!UserObj) {
        res.status(400).send({
            msg: 'invalid'
        })
        return
    }

    let resData = {
        UserGenderChange: false,
        UserSignatureChange: false,
        UserBirthdayChange: false,
    }

    for (const key in req.body) {
        if (key === 'UserGender') {
            await UserObj.update({
                UserGender: req.body[key]
            })
            resData.UserGenderChange = true
        }
        if (key === 'Signature') {
            await UserObj.update({
                Signature: req.body[key]
            })
            resData.UserSignatureChange = true
        }
        if (key === 'Birthday') {
            await UserObj.update({
                Birthday: req.body[key]
            })
            resData.UserBirthdayChange = true
        }
        UserObj.save()
    }

    res.status(200).send({
        resData,
        msg: '修改成功'
    })
})

app.post('/api/event/update', async (req, res) => {
    if (!req.body.token) {
        res.status(400).send({
            msg: 'invalid_token',
            detail: '缺少 token'
        })
        return
    }

    let userName, event
    try {
        userName = jwt.verify(req.body.token, jwtKey).username
        event = req.body.event
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(400).send({
                msg: 'invalid_token',
                detail: 'token 过期'
            })
        } else {
            logger.info(err)
            res.status(400).send({
                msg: 'invalid_token',
                detail: '其他错误'
            })
        }
        return
    }

    if (!await User.findOne({ where: { username: userName } })) {
        res.status(400).send({
            msg: 'invalid_token',
            detail: '用户名错误'
        })
        return
    }

    if (!await Event.findOne({ where: { id: event.id, username: userName } })) {
        res.status(400).send({
            msg: 'invalid',
            detail: '用户没有对应的事件'
        })
        return
    }

    event.username = userName
    await Event.update(event, { where: { id: event.id, username: userName } })

    logger.info(`用户#${userName} 更新了事件#${event.id}`)

    res.sendStatus(200)
})

app.post('/api/event/getAll', async (req, res) => {
    if (!req.body.token) {
        res.status(400).send({
            msg: 'invalid_token',
            detail: '缺少 token'
        })
        return
    }

    let userName
    try {
        userName = jwt.verify(req.body.token, jwtKey).username
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(400).send({
                msg: 'invalid_token',
                detail: 'token 过期'
            })
            logger.info(`用户#${userName} 的 token 过期了`)
        } else {
            logger.info(err)
            res.status(400).send({
                msg: 'invalid_token',
                detail: '其他错误'
            })
        }
        return
    }

    if (!await User.findOne({ where: { username: userName } })) {
        res.status(400).send({
            msg: 'invalid_token',
            detail: '用户名错误'
        })
        return
    }

    let eventList = await Event.findAll({ where: { username: userName } })
    logger.info(`用户#${userName} 查询所有事件`, eventList)

    res.status(200).send(eventList)
})

app.post('/api/event/create', async (req, res) => {
    if (!req.body.token) {
        res.status(400).send({
            msg: 'invalid_token',
            detail: '缺少 token'
        })
        return
    }

    let userName, event
    try {
        userName = jwt.verify(req.body.token, jwtKey).username
        event = req.body.event
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(400).send({
                msg: 'invalid_token',
                detail: 'token 过期'
            })
        } else {
            logger.info(err)
            res.status(400).send({
                msg: 'invalid_token',
                detail: '其他错误'
            })
        }
        return
    }

    if (!await User.findOne({ where: { username: userName } })) {
        res.status(400).send({
            msg: 'invalid_token',
            detail: '用户名错误'
        })
        return
    }

    if (await Event.findOne({ where: { id: event.id } })) {
        res.status(400).send({
            msg: 'duplicate_id',
            detail: '事件 id 重复'
        })
        return
    }

    event.username = userName
    await Event.create(event)

    logger.info(`用户#${userName} 创建了事件#${event.id}`)

    res.sendStatus(200)
})

app.post('/api/event/delete', async (req, res) => {
    if (!req.body.token) {
        res.status(400).send({
            msg: 'invalid_token',
            detail: '缺少 token'
        })
        return
    }

    let userName, id
    try {
        userName = jwt.verify(req.body.token, jwtKey).username
        id = req.body.id
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(400).send({
                msg: 'invalid_token',
                detail: 'token 过期'
            })
        } else {
            logger.info(err)
            res.status(400).send({
                msg: 'invalid_token',
                detail: '其他错误'
            })
        }
        return
    }

    if (!await User.findOne({ where: { username: userName } })) {
        res.status(400).send({
            msg: 'invalid_token',
            detail: '用户名错误'
        })
        return
    }

    if (!await Event.findOne({ where: { id: id, username: userName } })) {
        res.status(400).send({
            msg: 'invalid',
            detail: '用户没有对应的事件'
        })
        return
    }

    await Event.destroy({ where: { id: id, username: userName } })

    logger.info(`用户#${userName} 删除了事件#${id}`)

    res.sendStatus(200)
})

/**
 * 运行服务器
 */
app.listen(port, () => {
    logger.info(`服务器开始运行: http://127.0.0.1:${port}`)
})