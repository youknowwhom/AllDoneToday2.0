import sequelize from 'sequelize'
import logger from '../logger.js'

/**
 *  邮箱地址与验证码 数据库对象
 */

const db_emailSession = new sequelize.Sequelize('verificationSession.dev.db', null, null, {
    dialect: 'sqlite',
    storage: 'db/verificationSession.dev.db',
    logging: msg => logger.debug(msg)
})

class EmailVerifySession extends sequelize.Model { }

EmailVerifySession.init({
    email: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    sequelize: db_emailSession,
    paranoid: false,
    timestamps: true,
    updatedAt: false,
})

/**
 * 将模型与数据库同步
 * 如有必要，会对数据库作更改
 */
await EmailVerifySession.sync({
    alter: true,
    match: /_dev$/
})

export { db_emailSession as EmailVerifySessionDB, EmailVerifySession }