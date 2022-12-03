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


/**
 * 导入数据库
 */
import { UserdataDB, User } from './db/userdata.js'
import { EventDB, Event } from './db/event.js'
try {
    await UserdataDB.authenticate()
    await EventDB.authenticate()
    logger.info('成功连接到数据库')
} catch (error) {
    logger.error('无法连接到数据库: ', error)
    process.exit(-1)
}


/**
 * 注册 API
 * - request
 *  - username: 用户名
 *  - passwordHash: 密码Hash
 *  - EmailAddress: 邮箱地址
 *  - SecurityCode: 验证码
 * - response
 *  - IsFormValid: 判断post表单是否数据正确
 *    - 如果不正确返回四个boolean值(真值)
 *      - IsUserNameEmpty: 用户名是否为空
 *      - IsPasswordEmpty: 密码是否为空
 *      - IsEmailAddressEmpty: 邮箱地址是否为空
 *      - IsSecurityCodeEmpty: 验证码是否为空
 *    - 如果正确上述boolean值不存在，进入下面的判断
 *    *注意：Json格式已经不一样
 *  - IsSecurityCodeTrue:验证码正确判断
 *  - IsUsernameTrue：用户名是否合法
 * --ToDo
 *   由于无法写入数据库 先使用伪数据
 */
app.post('/api/user/signup', async (req, res) => {
    const username = req.body.UserName
    const PasswordHash = req.body.PasswordHash
    const EmailAddress = req.body.EmailAddress
    //const SecurityCode = req.body.SecurityCode

    let IsUserNameEmpty = username ? false : true
    let IsPasswordEmpty = PasswordHash ? false : true
    let IsEmailAddressEmpty = EmailAddress ? false : true
    //let IsSecurityCodeEmpty = SecurityCode ? false : true

    //logger.info(SecurityCode)
    //if (IsUserNameEmpty || IsPasswordEmpty || IsEmailAddressEmpty || IsSecurityCodeEmpty) {
    if (IsUserNameEmpty || IsPasswordEmpty || IsEmailAddressEmpty) {
        res.status(200).send({
            IsFormValid: false,
            IsUserNameEmpty: IsUserNameEmpty,
            IsPasswordEmpty: IsPasswordEmpty,
            IsEmailAddressEmpty: IsEmailAddressEmpty,
            //IsSecurityCodeEmpty: IsSecurityCodeEmpty,
            msg: '登录格式不正确'
        })
        return
    }

    /**
     * Todo：找数据库中有无用户名
     * 验证码是否实现
     * （未成功）
     */
    // 数据库中查找 username

    const UserObj = await User.findOne({
        where: {
            username: username
        }
    })

    if (UserObj) {
        res.status(400).send({
            IsFormValid: true,
            //IsSecurityCodeTrue: IsSecurityCodeTrue,
            IsUsernameTrue: false,
            msg: '用户输入信息不符合'
        })
        return
    }
    else {
        let newUser = User.build({
            username: username,
            passwordHash: PasswordHash,
            EmailAddress: EmailAddress
        })
        await newUser.save()
        res.status(200).send({
            IsFormValid: true,
            //IsSecurityCodeTrue: true,
            IsUsernameTrue: true,
            msg: '注册成功'
        })
    }
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
 * 忘记密码
 *  - request
 *   - EmailAddress: 邮箱地址
 *   - SecurityCode: 验证码
 *   - PasswordHash: 修改好的密码
 *  - respond:
 *   - IsSecurityCodeTrue: 验证码是否正确
 *   - IsUsernameTrue: 用户名是否正确(防止未注册使用)
 *   - IsEmailAddressValid: 邮箱是否有效
 */
app.post('/api/user/forgetPassword', async (req, res) => {
    const EmailAddress = req.body.EmailAddress
    const SecurityCode = req.body.SecurityCode
    const PasswordHash = req.body.PasswordHash

    /**
     * 请求格式判断
     */

    if (!EmailAddress || !SecurityCode || !PasswordHash) {
        res.status(200).send({
            IsSecurityCodeTrue: undefined,
            msg: '忘记密码请求格式出错'
        })
        return
    }

    // let requestedUser = User.findOne({
    //     where:{
    //         EmailAddress:EmailAddress
    //     }
    // })


    /**
     * 发邮箱不会
     */


    if (SecurityCode !== '123456') {
        res.status(200).send({
            IsSecurityCodeTrue: false,
            msg: '验证码不正确'
        })
        return
    }

    res.status(200).send({
        IsSecurityCodeTrue: true,
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