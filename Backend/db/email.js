import sequelize from 'sequelize'
import logger from '../logger.js'

/**
 *  邮箱地址与验证码 数据库对象
 */

const db_email = new sequelize.Sequelize('emaildata.dev.db',null,null,{
    dialect:'sqlite',
    storage: 'db/emaildata.dev.db',
    logging: msg=> logger.debug(msg)
})

/**
 *  Email 模型
 */

class Email extends sequelize.Model { }

Email.init({
    EmailAddress:{
        type:sequelize.DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    CheckCode:{
        type:sequelize.DataTypes.STRING,
        allowNull:false
    }
},{
    sequelize:db_email,
    paranoid: false,
    timestamps: false
})

/**
 * 将模型与数据库同步
 * 如有必要，会对数据库作更改
 */
await Email.sync({
    alter: true,
    match: /_dev$/
})

export {db_email as EmailDB, Email}