import sequelize from 'sequelize'
import logger from '../logger.js'


/**
 * 用户数据 数据库对象
 * 
 * - 默认为 dev 数据库
 *   - TODO: 增加 test 和 prod 数据库
 * - 使用 pino logger
 */
const db = new sequelize.Sequelize('userdata.dev', null, null, {
    dialect: 'sqlite',
    storage: 'db/userdata.dev.db',
    logging: msg => logger.debug(msg)
})

/**
 * User 模型
 * 
 * - 存储用户基本信息
 *   - 用户名
 *   - 密码 hash 值
 */
class User extends sequelize.Model { }
User.init({
    /**
     * 用户名
     *   - TODO: 增加长度限制
     */
    username: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    /**
     * 密码 hash 值
     */
    passwordHash: {
        type: sequelize.DataTypes.STRING,
        allowNull: false
    },
    /**
     * 邮箱地址
     */
    EmailAddress: {
        type: sequelize.DataTypes.STRING,
        allowNull: false
    },
    /**
     * 性别
     */
    UserGender:{
        type:sequelize.DataTypes.STRING,
        allowNull: true
    },
    /**
     *  个性签名
     */
    Signature:{
        type:sequelize.DataTypes.STRING,
        allowNull:true
    },
    /**
     * 用户生日
     */
    BirthDay:{
        type: sequelize.DataTypes.TEXT,
        get: function () {
            return new Date(this.getDataValue('BirthDay'))
        },
        set: function (value) {
            return this.setDataValue('BirthDay', new Date(value).toDateString())
        },
    },
    /**
     * 头像url
     */
    Photourl:{
        type:sequelize.DataTypes.STRING,
        allowNull:true
    }
}, {
    sequelize: db,
    paranoid: false,
    timestamps: false
})


/**
 * 将模型与数据库同步
 * 如有必要，会对数据库作更改
 */
await User.sync({
    alter: true,
    match: /_dev$/
})

export { db as UserdataDB, User }