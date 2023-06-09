import express from 'express'
import jwt from 'jsonwebtoken'
let jwtKey = 'ToDoList_Backend_JSONWebToken_Key_JustForTesting_20221121'
const port = 8000
const app = express()

import crypto from 'crypto'

async function sha256(message) {
    return crypto.createHash('sha256').update(message).digest('hex')
}

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
let serverConfig
try {
    serverConfig = JSON.parse(await fs.readFile('./serverConfig.json', { encoding: 'utf-8' }))
} catch (err) {
    logger.error('读取服务器配置文件 serverConfig.json 失败')
    logger.warn('正在使用默认配置文件 serverConfig.default.json ，部分功能（如邮箱验证）可能无法使用')
    serverConfig = JSON.parse(await fs.readFile('./serverConfig.default.json', { encoding: 'utf-8' }))
}

logger.info({
    msg: '读取到服务器配置：',
    serverConfig
})


/**
 * 导入数据库
 */
import { UserdataDB, User } from './db/userdata.js'
import { EventDB, Event } from './db/event.js'
import { CurriculumDB, Course } from './db/curriculum.js'
import { EmailVerifySessionDB, EmailVerifySession } from './db/email.js'
import { Op } from 'sequelize'
try {
    await UserdataDB.authenticate()
    await EventDB.authenticate()
    await EmailVerifySessionDB.authenticate()
    await CurriculumDB.authenticate()
    logger.info('成功连接到数据库')
} catch (error) {
    logger.error('无法连接到数据库: ', error)
    process.exit(-1)
}

/**
 * 创建测试用户
 */
await (async () => {
    if (await User.findAll({ where: { username: serverConfig.testUser.username } })) {
        logger.warn(`已有账户与测试用户 ${serverConfig.testUser.username} 重名，即将清除`)
    }
    await User.destroy({
        where: {
            username: serverConfig.testUser.username
        }
    })
    await User.create({
        username: serverConfig.testUser.username,
        passwordHash: await sha256(serverConfig.testUser.password),
        EmailAddress: 'test@test.test',
        UserGender: '男',
        Signature: 'Wo shi wawa',
        BirthDay: new Date(2002, 9, 8),
    })
    logger.info(`已经创建测试用户 ${serverConfig.testUser.username}，密码为 ${serverConfig.testUser.password}`)
})()

logger.info(`邮箱验证码冷却时间为 ${serverConfig.emailVerification.cooldown} 秒，过期时间为 ${serverConfig.emailVerification.expire} 秒`)

const RemoveExpiredEmailVerifySession = async () => {
    const expired = await EmailVerifySession.findAll({
        where: {
            createdAt: {
                [Op.lt]: new Date() - serverConfig.emailVerification.expire * 1000,
            }
        }
    })
    if (expired.length) {
        logger.info('以下电子邮箱验证码已经过期，即将删除：')
        for (let s of expired) {
            logger.info(`${s.email} : ${s.code}, 发送于 ${s.createdAt}`)
        }
    }
    await EmailVerifySession.destroy({ where: { code: expired.map(s => s.code) } })
}

await RemoveExpiredEmailVerifySession()

import nodemailer from 'nodemailer'
const verificationMailer = nodemailer.createTransport(serverConfig.emailVerification.mailer)

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
        while (await EmailVerifySession.findOne({ where: { code: code } })) {
            code = Generate()
        }
        return code
    }

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

    logger.info(`收到向 ${email} 发送验证码的请求`)

    if (!email) {
        res.status(400).send({
            type: 'invalid',
            msg: '电子邮箱地址无效',
        })
        return
    }

    await RemoveExpiredEmailVerifySession()

    for (let s of await EmailVerifySession.findAll({ where: { email: email, } })) {
        logger.info(`${s.email} 的暂时还有效的验证码： ${s.code} （${s.createdAt}）`)
    }

    let lastSend = await EmailVerifySession.max('createdAt', { where: { email: email } })

    logger.info(`上一条验证码在 ${lastSend} 发出`)

    if (lastSend > new Date() - serverConfig.emailVerification.cooldown * 1000) {
        logger.info(`上一条在 ${serverConfig.emailVerification.cooldown} 秒内发出，取消发送`)
        res.status(400).send({
            type: 'cooldown',
            cd: serverConfig.emailVerification.cooldown - (new Date() - lastSend) / 1000,
        })
        return
    }

    try {
        const code = await GenerateCode()

        await verificationMailer.sendMail({
            from: {
                name: '今日毕',
                address: serverConfig.emailVerification.mailer.auth.user,
            },
            to: email,
            subject: '今日毕 - 您的邮箱验证码',
            text: `您的邮箱验证码为：\n${code}\n此验证码 ${Math.round(serverConfig.emailVerification.expire / 60)} 分钟内有效`
        })

        await EmailVerifySession.create({ email: email, code: code })

        logger.info(`已经发送验证码 ${code} 给 ${email}`)
    } catch (err) {
        logger.error(err)
        res.status(400).send({
            type: 'error',
            msg: '验证码发送失败',
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
        logger.info({ msg: '已拒绝注册请求', '原因': '未填写用户名' })
        return
    }

    if (!PasswordHash) {
        res.status(400).send({ msg: '未填写密码' })
        logger.info({ msg: '已拒绝注册请求', '原因': '未填写密码' })
        return
    }

    if (!EmailAddress) {
        res.status(400).send({ msg: '未填写电子邮箱地址' })
        logger.info({ msg: '已拒绝注册请求', '原因': '未填写电子邮箱地址', '请求体': req.body })
        return
    }

    if (!VerificationCode) {
        res.status(400).send({ msg: '验证码为空' })
        logger.info({ msg: '已拒绝注册请求', '原因': '验证码为空', '请求体': req.body })
        return
    }

    if (await User.findOne({ where: { username: username } })) {
        res.status(400).send({ msg: '该用户名已被使用' })
        logger.info({ msg: '已拒绝注册请求', '原因': '该用户名已被使用', '请求体': req.body })
        return
    }

    if (await User.findOne({ where: { EmailAddress: EmailAddress } })) {
        res.status(400).send({ msg: '该邮箱已被使用' })
        logger.info({ msg: '已拒绝注册请求', '原因': '该邮箱已被使用', '请求体': req.body })
        return
    }

    await RemoveExpiredEmailVerifySession()

    if (!await EmailVerifySession.findOne({ where: { email: EmailAddress, code: VerificationCode } })) {
        res.status(400).send({ msg: '验证码错误或已失效' })
        logger.info({ msg: '已拒绝注册请求', '原因': '验证码错误或已失效', '请求体': req.body })
        return
    }

    logger.info({ msg: '收到合法注册请求', body: req.body, })

    let newUser = {
        username: username,
        passwordHash: PasswordHash,
        EmailAddress: EmailAddress
    }

    await User.create(newUser)

    logger.info({ msg: '新增了用户', user: newUser })

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
        res.status(400).send({ result: 'fail', msg: '用户名或密码为空' })
        logger.info({ msg: '已拒绝登录请求', '原因': '用户名或密码为空', '请求体': req.body })
        return
    }
    const requestedUser = await User.findOne({
        where: { username: username }
    }) // 由于 username 是 unique 的，所以可以使用 findOne
    if (!requestedUser) {
        res.status(400).send({ result: 'fail', msg: '用户名或密码错误' })
        logger.info({ msg: '已拒绝登录请求', '原因': '用户名或密码错误', '请求体': req.body })
        return
    }
    if (requestedUser.passwordHash != passwordHash) {
        res.status(400).send({ result: 'fail', msg: '用户名或密码错误' })
        logger.info({ msg: '已拒绝登录请求', '原因': '用户名或密码错误', '请求体': req.body })
        return
    }
    let jwtBody = {
        username: requestedUser.username,
    }
    let token = jwt.sign(jwtBody, jwtKey, {
        expiresIn: '30d'
    })
    logger.info({ msg: `用户 ${requestedUser.username} 登录成功，已签发新 token: ${token}` })
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
        logger.info({ msg: '已拒绝重置密码请求', '原因': '未填写用户名' })
        return
    }

    if (!PasswordHash) {
        res.status(400).send({ msg: '未填写密码' })
        logger.info({ msg: '已拒绝重置密码请求', '原因': '未填写密码' })
        return
    }

    if (!EmailAddress) {
        res.status(400).send({ msg: '未填写电子邮箱地址' })
        logger.info({ msg: '已拒绝重置密码请求', '原因': '未填写电子邮箱地址', '请求体': req.body })
        return
    }

    if (!VerificationCode) {
        res.status(400).send({ msg: '验证码为空' })
        logger.info({ msg: '已拒绝重置密码请求', '原因': '验证码为空', '请求体': req.body })
        return
    }

    let targetUser = await User.findOne({ where: { username: username } })

    if (!targetUser) {
        res.status(400).send({ msg: '用户不存在' })
        logger.info({ msg: '已拒绝重置密码请求', '原因': '用户不存在', '请求体': req.body })
        return
    }

    if (targetUser.EmailAddress != EmailAddress) {
        res.status(400).send({ msg: '邮箱不正确' })
        logger.info({ msg: '已拒绝重置密码请求', '原因': '邮箱不正确', '请求体': req.body })
        return
    }

    await RemoveExpiredEmailVerifySession()

    if (!await EmailVerifySession.findOne({ where: { email: EmailAddress, code: VerificationCode } })) {
        res.status(400).send({ msg: '验证码错误或已失效' })
        logger.info({ msg: '已拒绝重置密码请求', '原因': '验证码错误或已失效', '请求体': req.body })
        return
    }

    logger.info({ msg: '收到合法重置密码请求', body: req.body, })

    try {
        await User.update({ PasswordHash: PasswordHash }, { where: { username: username } })
    } catch (err) {
        res.status(400).send({ msg: '未知错误' })
        logger.error({ msg: '重置密码失败', '用户名': username, '请求体': req.body })
        return
    }

    res.status(200).send({ msg: '重置密码成功' })
    logger.info(`用户 ${username} 重置密码成功`)
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
        res.status(400).send({ msg: 'invalid' })
        logger.info({ msg: '已拒绝获取个人信息请求', 'token 校验结果': 'invalid' })
        return
    }

    let userName = ''
    try {
        userName = jwt.verify(req.body.token, jwtKey).username
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(400).send({ msg: 'expired' })
            logger.info({ msg: '已拒绝获取个人信息请求', 'token 校验结果': 'expired' })
        } else {
            logger.info(err)
            res.status(400).send({ msg: 'invalid' })
            logger.info({ msg: '已拒绝获取个人信息请求', 'token 校验结果': 'invalid' })
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
    logger.info({ msg: `用户 ${userName} 读取了个人信息` })
})

app.post('/api/user/verifyToken', async (req, res) => {
    if (!req.body.token) {
        res.sendStatus(400)
        logger.info({ msg: '校验 token 失败', token: req.body.token })
        return
    }

    let userName
    try {
        userName = jwt.verify(req.body.token, jwtKey).username
    } catch (err) {
        res.sendStatus(400)
        logger.info({ msg: '校验 token 失败', token: req.body.token })
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
        logger.info({ msg: '校验 token 失败', token: req.body.token })
        return
    }

    logger.info(`用户 ${userName} 校验 token 成功`)

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
        res.status(400).send({ msg: 'invalid' })
        logger.info({ msg: '已拒绝个人信息更新请求', 'token 校验结果': 'invalid' })
        return
    }

    let userName = ''
    try {
        userName = jwt.verify(req.body.token, jwtKey).username
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(400).send({ msg: 'expired' })
            logger.info({ msg: '已拒绝个人信息更新请求', 'token 校验结果': 'expired' })
        } else {
            logger.info(err)
            res.status(400).send({ msg: 'invalid' })
            logger.info({ msg: '已拒绝个人信息更新请求', 'token 校验结果': 'invalid' })
        }
        return
    }

    const UserObj = await User.findOne({
        where: {
            username: userName
        }
    })

    if (!UserObj) {
        res.status(400).send({ msg: 'invalid' })
        logger.info({ msg: '已拒绝个人信息更新请求', 'token 校验结果': 'invalid' })
        return
    }

    let resData = {
        UserGenderChange: false,
        UserSignatureChange: false,
        UserBirthdayChange: false,
    }

    for (const key in req.body) {
        if (key === 'UserGender') {
            await UserObj.update({ UserGender: req.body[key] })
            resData.UserGenderChange = true
        }
        if (key === 'Signature') {
            await UserObj.update({ Signature: req.body[key] })
            resData.UserSignatureChange = true
        }
        if (key === 'Birthday') {
            await UserObj.update({ Birthday: req.body[key] })
            resData.UserBirthdayChange = true
        }
        UserObj.save()
    }

    res.status(200).send({ resData, msg: '修改成功' })
    logger.info({ msg: `用户 ${userName} 更新了个人信息` })
})

app.post('/api/event/update', async (req, res) => {
    if (!req.body.token) {
        res.status(400).send({ msg: 'invalid_token', detail: '缺少 token' })
        return
    }

    let userName, event
    try {
        userName = jwt.verify(req.body.token, jwtKey).username
        event = req.body.event
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(400).send({ msg: 'invalid_token', detail: 'token 过期' })
            logger.info({ msg: '已拒绝更新代办事项请求', '原因': 'token 过期' })
        } else {
            logger.info(err)
            res.status(400).send({ msg: 'invalid_token', detail: '其他错误' })
            logger.info({ msg: '已拒绝更新代办事项请求', '原因': '其他错误' })
        }
        return
    }

    if (!await User.findOne({ where: { username: userName } })) {
        res.status(400).send({ msg: 'invalid_token', detail: '用户名错误' })
        logger.info({ msg: '已拒绝更新代办事项请求', '原因': '用户名错误' })
        return
    }

    if (!await Event.findOne({ where: { id: event.id, username: userName } })) {
        res.status(400).send({ msg: 'invalid', detail: '用户没有对应的事件' })
        logger.info({ msg: '已拒绝更新代办事项请求', '原因': '用户没有对应的事件' })
        return
    }

    event.username = userName
    await Event.update(event, { where: { id: event.id, username: userName } })

    logger.info(`用户 ${userName} 更新了事件 ${event.id}`)

    res.sendStatus(200)
})

app.post('/api/event/getAll', async (req, res) => {
    if (!req.body.token) {
        res.status(400).send({ msg: 'invalid_token', detail: '缺少 token' })
        logger.info({ msg: '已拒绝获取代办事项请求', '原因': '缺少 token' })
        return
    }

    let userName
    try {
        userName = jwt.verify(req.body.token, jwtKey).username
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(400).send({ msg: 'invalid_token', detail: 'token 过期' })
            logger.info({ msg: '已拒绝获取代办事项请求', '原因': 'token 过期' })
            logger.info(`用户 ${userName} 的 token 过期了`)
        } else {
            logger.info(err)
            res.status(400).send({ msg: 'invalid_token', detail: '其他错误' })
            logger.info({ msg: '已拒绝获取代办事项请求', '原因': '其他错误' })
        }
        return
    }

    if (!await User.findOne({ where: { username: userName } })) {
        res.status(400).send({ msg: 'invalid_token', detail: '用户名错误' })
        logger.info({ msg: '已拒绝获取代办事项请求', '原因': '用户名错误' })
        return
    }

    let eventList = await Event.findAll({ where: { username: userName } })
    logger.info(`用户 ${userName} 查询了所有事件`)

    res.status(200).send(eventList)
})

app.post('/api/event/create', async (req, res) => {
    if (!req.body.token) {
        res.status(400).send({ msg: 'invalid_token', detail: '缺少 token' })
        logger.info({ msg: '已拒绝创建事件请求', '原因': '缺少 token' })
        return
    }

    let userName, event
    try {
        userName = jwt.verify(req.body.token, jwtKey).username
        event = req.body.event
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(400).send({ msg: 'invalid_token', detail: 'token 过期' })
            logger.info({ msg: '已拒绝创建事件请求', '原因': 'token 过期' })
        } else {
            logger.info(err)
            res.status(400).send({ msg: 'invalid_token', detail: '其他错误' })
            logger.info({ msg: '已拒绝创建事件请求', '原因': '其他错误' })
        }
        return
    }

    if (!await User.findOne({ where: { username: userName } })) {
        res.status(400).send({ msg: 'invalid_token', detail: '用户名错误' })
        logger.info({ msg: '已拒绝创建事件请求', '原因': '用户名错误' })
        return
    }

    if (await Event.findOne({ where: { id: event.id } })) {
        res.status(400).send({ msg: 'duplicate_id', detail: '事件 id 重复' })
        logger.info({ msg: '已拒绝创建事件请求', '原因': '事件 id 重复' })
        return
    }

    event.username = userName
    await Event.create(event)

    logger.info(`用户 ${userName} 创建了事件 ${event.id}`)

    res.sendStatus(200)
})

app.post('/api/event/delete', async (req, res) => {
    if (!req.body.token) {
        res.status(400).send({ msg: 'invalid_token', detail: '缺少 token' })
        logger.info({ msg: '已拒绝删除代办事项请求', '原因': '缺少 token' })
        return
    }

    let userName, id
    try {
        userName = jwt.verify(req.body.token, jwtKey).username
        id = req.body.id
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(400).send({ msg: 'invalid_token', detail: 'token 过期' })
            logger.info({ msg: '已拒绝删除代办事项请求', '原因': 'token 过期' })
        } else {
            logger.info(err)
            res.status(400).send({ msg: 'invalid_token', detail: '其他错误' })
            logger.info({ msg: '已拒绝删除代办事项请求', '原因': '其他错误' })
        }
        return
    }

    if (!await User.findOne({ where: { username: userName } })) {
        res.status(400).send({ msg: 'invalid_token', detail: '用户名错误' })
        logger.info({ msg: '已拒绝删除代办事项请求', '原因': '用户名错误' })
        return
    }

    if (!await Event.findOne({ where: { id: id, username: userName } })) {
        res.status(400).send({ msg: 'invalid', detail: '用户没有对应的事件' })
        logger.info({ msg: '已拒绝删除代办事项请求', '原因': '用户没有对应的事件' })
        return
    }

    await Event.destroy({ where: { id: id, username: userName } })

    logger.info(`用户 ${userName} 删除了事件 ${id}`)

    res.sendStatus(200)
})

/**
 *  添加新课程
 */
app.post('/api/curriculum/create', async (req, res) => {
    if (!req.body.token) {
        res.status(400).send({ msg: 'invalid_token', detail: '缺少 token' })
        logger.info({ msg: '已拒绝添加课程请求', '原因': '缺少 token' })
        return
    }

    let userName, course
    try {
        userName = jwt.verify(req.body.token, jwtKey).username
        course = req.body.course
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(400).send({ msg: 'invalid_token', detail: 'token 过期' })
            logger.info({ msg: '已拒绝添加课程请求', '原因': 'token 过期' })
        } else {
            logger.info(err)
            res.status(400).send({ msg: 'invalid_token', detail: '其他错误' })
            logger.info({ msg: '已拒绝添加课程请求', '原因': '其他错误' })
        }
        return
    }

    if (!await User.findOne({ where: { username: userName } })) {
        res.status(400).send({ msg: 'invalid_token', detail: '用户名错误' })
        logger.info({ msg: '已拒绝添加课程请求', '原因': '用户名错误' })
        return
    }

    course.username = userName
    try{
        course = await Course.create(course)
    }catch(err){
        if (err instanceof jwt.TokenExpiredError) {
            logger.info(err)
            res.status(400).send({ msg: 'missing_field', detail: '缺少应有字段' })
            logger.info({ msg: '已拒绝添加课程请求', '原因': '用户名错误' })
        } else {
            logger.info(err)
            res.status(400).send({ msg: 'unknown_error', detail: '其他错误' })
            logger.info({ msg: '已拒绝添加课程请求', '原因': '其他错误' })
        }
    }

    logger.info(`用户 ${userName} 创建了课程 ${course.id}`)

    res.sendStatus(200)
})


/**
 *  删除已有课程
 */
app.post('/api/curriculum/delete', async (req, res) => {
    if (!req.body.token) {
        res.status(400).send({ msg: 'invalid_token', detail: '缺少 token' })
        logger.info({ msg: '已拒绝删除课程请求', '原因': '缺少 token' })
        return
    }

    let userName, id
    try {
        userName = jwt.verify(req.body.token, jwtKey).username
        id = req.body.id
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(400).send({ msg: 'invalid_token', detail: 'token 过期' })
            logger.info({ msg: '已拒绝删除课程请求', '原因': 'token 过期' })
        } else {
            logger.info(err)
            res.status(400).send({ msg: 'invalid_token', detail: '其他错误' })
            logger.info({ msg: '已拒绝删除课程请求', '原因': '其他错误' })
        }
        return
    }

    if(!id){
        res.status(400).send({ msg: 'missing_filed', detail: '缺少id字段' })
        logger.info({ msg: '已拒绝删除课程请求', '原因': '缺少id字段' })
        return
    }

    if (!await User.findOne({ where: { username: userName } })) {
        res.status(400).send({ msg: 'invalid_token', detail: '用户名错误' })
        logger.info({ msg: '已拒绝删除课程请求', '原因': '用户名错误' })
        return
    }

    if (!await Course.findOne({ where: { username: userName, id: id } })) {
        res.status(400).send({ msg: 'invalid_token', detail: '课程id错误' })
        logger.info({ msg: '已拒绝删除课程请求', '原因': '课程id错误' })
        return
    }
    
    Course.destroy({ where: { username: userName, id: id } })

    logger.info(`用户 ${userName} 删除了课程 ${id}`)

    res.sendStatus(200)
})


/**
 *  查询某周所有的课程
 */
app.post('/api/curriculum/getweekcourses', async (req, res) => {
    if (!req.body.token) {
        res.status(400).send({ msg: 'invalid_token', detail: '缺少 token' })
        logger.info({ msg: '已拒绝查询课程请求', '原因': '缺少 token' })
        return
    }

    let userName, weekId
    try {
        userName = jwt.verify(req.body.token, jwtKey).username
        weekId = req.body.weekId
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(400).send({ msg: 'invalid_token', detail: 'token 过期' })
            logger.info({ msg: '已拒绝查询课程请求', '原因': 'token 过期' })
        } else {
            logger.info(err)
            res.status(400).send({ msg: 'invalid_token', detail: '其他错误' })
            logger.info({ msg: '已拒绝查询课程请求', '原因': '其他错误' })
        }
        return
    }

    if (!await User.findOne({ where: { username: userName } })) {
        res.status(400).send({ msg: 'invalid_token', detail: '用户名错误' })
        logger.info({ msg: '已拒绝查询课程请求', '原因': '用户名错误' })
        return
    }

    let courseList
    try{
        courseList = await Course.findAll({ where : { username: userName } })
    }catch(err){
        logger.info(err)
        res.status(400).send({ msg: 'invalid_token', detail: '其他错误' })
        logger.info({ msg: '已拒绝查询课程请求', '原因': '其他错误' })
    }

    if(!courseList){
        res.status(400).send({ msg: 'missing_field', detail: '缺少course字段' })
        logger.info({ msg: '已拒绝查询课程请求', '原因': '缺少course字段' })
    }
    
    
    courseList = courseList.filter(item => {
        return item.weeks.includes(weekId)
    })

    logger.info(`用户 ${userName} 查询了第 ${weekId} 周的课程`)

    res.status(200).send({ 'courses' : courseList })
})



/**
 * 运行服务器
 */
app.listen(port, () => {
    logger.info(`服务器开始运行: http://127.0.0.1:${port}`)
})