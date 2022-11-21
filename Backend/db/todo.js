import sequelize from 'sequelize'
import logger from '../logger.js'


/**
 * 待办事项 数据库对象
 * 
 * - 默认为 dev 数据库
 *   - TODO: 增加 test 和 prod 数据库
 * - 使用 pino logger
 */
const db = new sequelize.Sequelize('todo_dev', null, null, {
    dialect: 'sqlite',
    storage: 'db/todo_dev.db',
    logging: msg => logger.debug(msg)
})

/**
 * Event 模型
 * 
 * - 存储待办事项基本信息
 *   - 待办事项名
 *   - 密码 hash 值
 */
class Event extends sequelize.Model { }
Event.init({
    brief: {
        type: sequelize.DataTypes.STRING,
    },
    description: {
        type: sequelize.DataTypes.STRING,
    },
    finished: {
        type: sequelize.DataTypes.BOOLEAN,
    },
}, {
    sequelize: db,
    paranoid: false,
    timestamps: false
})


/**
 * 将模型与数据库同步
 * 如有必要，会对数据库作更改
 */
await Event.sync({
    alter: true,
    match: /_dev$/
})

/**
 * 创建测试待办事项
 */
await (async () => {
    await Event.destroy({
        where: {
            Eventname: 'test'
        }
    })
    await Event.create({
        Eventname: 'test',
        passwordHash: 'test',
        EmailAddress: 'test@test.test'
    })
})()

export { db as todoDB, Event }