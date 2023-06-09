import sequelize from 'sequelize'
import logger from '../logger.js'


/**
 * 用户数据 数据库对象
 * 
 * - 默认为 dev 数据库
 *   - TODO: 增加 test 和 prod 数据库
 * - 使用 pino logger
 */
const db = new sequelize.Sequelize('curriculum.dev', null, null, {
    dialect: 'sqlite',
    storage: 'db/curriculum.dev.db',
    logging: msg => logger.debug(msg)
})

/**
 *  模型
 * 
 * - 存储用户基本信息
 *   - 用户名
 *   - 密码 hash 值
 */
class Course extends sequelize.Model { }
Course.init({
    /**
     * 存储在数据库中的课程ID
     */
    id: {
        type: sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },    
    /**
     * 用户名（该课程是哪个用户存储的）
     */
    username: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
    },
    /**
     * 课程号
     */
    courseId: {
        type: sequelize.DataTypes.STRING,
        allowNull: false
    },
    /**
     * 课程名称
     */
    courseName: {
        type: sequelize.DataTypes.STRING,
        allowNull: false
    },
    /**
     * 教师
     */
    teacher:{
        type:sequelize.DataTypes.STRING,
        allowNull: false
    },
    /**
     * 学分
     */
    score:{
        type:sequelize.DataTypes.STRING,
        allowNull: false
    },
    /**
     * 星期几
     */
    weekday:{
        type: sequelize.DataTypes.STRING,
        allowNull: false
    },
    /**
     * 上课地点
     */
    place:{
        type:sequelize.DataTypes.STRING,
        allowNull: true
    },
    /**
     * 开始节次
     */
    startTime:{
        type:sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    /**
     * 结束节次
     */
    endTime:{
        type:sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    /**
     * 上课周次
     */
    weeks:{
        type: sequelize.DataTypes.STRING,
        get: function () {
            var ret = this.getDataValue('weeks')
            ret = ret.split(',')
            ret = ret.map(Number)
            return ret
        },
        set: function (value) {
            console.log(value)
            return this.setDataValue('weeks', value.toString())
        },
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
await Course.sync({
    alter: true,
    match: /_dev$/
})

export { db as CurriculumDB, Course }