import sequelize from 'sequelize'
import logger from '../logger.js'

/**
 * 待办事项 数据库对象
 */
const db_event = new sequelize.Sequelize('eventdata.dev',null,null,{
    dialect:'sqlite',
    storage:'db/eventdata.dev.db',
    logging: msg=>logger.debug(msg)
})

/**
 * Event 模型
 */

class Event extends sequelize.Model { }
Event.init({
    eventid:{
        type:sequelize.DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    username:{
        type:sequelize.DataTypes.STRING,
        allowNull:false
    },
    brief:{
        type: sequelize.DataTypes.STRING,
        allowNull:false
    },
    description:{
        type: sequelize.DataTypes.STRING,
        allowNUll:true
    },
    finished:{
        type:sequelize.DataTypes.BOOLEAN,
        allowNull:false
    },
    importance:{
        type:sequelize.DataTypes.TEXT,
        get:function(){
            return JSON.parse(this.getDataValue('importance'))
        },
        set:function(value){
            return this.setDataValue('importance',JSON.stringify(value))
        },
        allowNull:false
    },
    time:{
        type:sequelize.DataTypes.TEXT,
        get:function(){
            return JSON.parse(this.getDataValue('time'))
        },
        set:function(value){
            return this.setDataValue('time',JSON.stringify(value))
        },
        allowNull:false
    }
},{
    sequelize:db_event,
    paranoid:false,
    timestamps:false
})

/**
 * 将模型与数据库同步
 * 如有必要，会对数据库作更改
 */
await Event.sync({
    alter:true,
    match:/_dev$/
})



export {db_event as EventDB,Event}