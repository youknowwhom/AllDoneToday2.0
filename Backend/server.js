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
 * - request
 *  - username: 用户名
 *  - passwordHash: 密码Hash
 *  - EmailAddress: 邮箱地址
 *  - SecurityCode: 验证码
 * - response
 *  - IsSecurityCodeTrue:验证码正确判断
 *  - IsUsernameTrue：用户名是否合法
 * --ToDo
 *   由于无法写入数据库 先使用伪数据
 */

app.post('/api/register', async (req, res) => {
    const username = req.body.UserName
    const passwordHash = req.body.PasswordHash
    const EmailAddress = req.body.EmailAddress
    const SecurityCode = req.body.SecurityCode
    if (!username || !passwordHash || !EmailAddress || 
        !SecurityCode) {
        res.status(400).send({
            IsUsernameTrue:undefined,
            IsSecurityCodeTrue:undefined,
            msg: '注册请求格式错误'
        })
        return
    }
    const requestedUser = User.findOne({
        where:{username:username}
    })//查找是否同名
    if(requestedUser.username){
        res.status(200).send({
            IsSecurityCodeTrue: undefined,
            IsUsernameTrue: false,
            msg:'用户名已经被占用'
        })
        return
    }
    if(SecurityCode!=='123456'){
        res.status(200).send({
            IsSecurityCodeTrue:false,
            IsUsernameTrue:true,
            msg:'验证码错误'
        })
    }

    /**
     * 暂时无法写入数据库
     */

    // const newUser = await User.create({
    //     username: username,
    //     passwordHash: passwordHash,
    //     EmailAddress:EmailAddress
    // })

    // logger.info(newUser)

    res.status(200).send({
        IsSecurityCodeTrue:true,
        IsUsernameTrue:true,
        msg:'注册成功'
    })// 注册成功
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
/**
 * 增加了写入token的内容
 */

import jwt from 'jsonwebtoken'

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
    var jwtBody = {
        username:requestedUser.username,
    }
    var jwtKey = 'whj'
    let token = jwt.sign(jwtBody,jwtKey)
    requestedUser.token = token
    logger.info(token)
    await requestedUser.save() //生成token 
    res.status(200).send({
        result: 'success',
        msg: '登录成功'
    })
})


/**
 * 忘记密码
 *  - request
 *   - username: 用户名
 *   - EmailAddress: 邮箱地址
 *   - SecurityCode: 验证码
 *   - PasswordHash: 修改好的密码
 *  - respond:
 *   - IsSecurityCodeTrue: 验证码是否正确
 *   - IsUsernameTrue: 用户名是否正确(防止未注册使用)
 *   - IsEmailAddressValid: 邮箱是否有效
 */
app.post('/api/forgetpassword',async (req,res)=>{
    const username = req.body.username
    const EmailAddress  =req.body.EmailAddress
    const passwordHash = req.body.passwordHash
    var requestedUser = User.findOne({
        where:{
            username:username
        }
    })
    if(!requestedUser){
        res.status(200).send({
            IsUsernameTrue:false,
            IsSecurityCodeTrue:undefined,
            IsEmailAddressValid:undefined,
            msg:'用户未注册'
        })
        return
    }
    if(requestedUser.EmailAddress!==EmailAddress){
        res.status(200).send({
            IsUsernameTrue:true,
            IsSecurityCodeTrue:false,
            IsEmailAddressValid:undefined,
            msg:'邮箱输入有误'
        })
        return
    }
    /**
     * 判断验证码
     */

    /**
     * 用户密码更新
     */
    requestedUser.passwordHash = passwordHash
    await requestedUser.save()

    res.status(200).send({
        IsUsernameTrue:true,
        IsSecurityCodeTrue:true,
        IsEmailAddressValid:true,
        msg:'密码已更新'
    })
})

/**
 * 运行服务器
 */
app.listen(port, () => {
    logger.info(`服务器开始运行: http://127.0.0.1:${port}`)
})