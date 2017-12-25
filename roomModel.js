'use strict';

const setting = require('./setting');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ErrCode = require('./errcode');

mongoose.connect(setting.mongo.url, { useMongoClient: true });
mongoose.Promise = global.Promise;

const RoomModelSchema = new Schema({
    id: { type : Number, index: { unique: true } }, 
    roomid: Number,                     // 房间id  
    createtime: Date,                   // 房间创建时间
    createUserName : String,            // 房间创建者
    createUserId :Schema.Types.ObjectId,// 创建者Id 
    gameid : Number,                    // 游戏id
    gameStartTime: Date,                // 游戏开始时间
    roomMaxIndex: {                     // 最大房间索引
        type: Number,
        default : 10000,    
    },               
    joinUser: [{
        userid : Schema.Types.ObjectId, // 用户id
        username : String,              // 下注用户的用户名
        teamid : String,                // 下注的队伍id
        score : Number,                 // 下注的分数
    }],  // 参与的玩家ObjectID
});

const RoomModel = mongoose.model('room', RoomModelSchema, 'room');

RoomModel.findOnePromise = (cb) => {
    return new Promise((resolve, reject) => {
        RoomModel.find(cb, (err, res) => {
            if(err) {
              reject(undefined);
            } else {
                resolve(res[0]);
            }
        });
    });
}

RoomModel.findByRoomID = (roomid) => {
    return RoomModel.findOnePromise({ 
        roomid : roomid 
    }); 
};

RoomModel.incrementRoomId = () => {
    return new Promise((resolve, reject) => {
        RoomModel.findOneAndUpdate({
            roomid : 0
        },{
            $inc : {roomMaxIndex : 1} 
        },async (err, result) => {
            if (err) 
            {
                reject(0);
            }
            else
            {
                if(result == null) {
                    let startRoomIndex = 10000;
                    
                    let indexModel = new RoomModel({roomid : 0, roomMaxIndex : startRoomIndex});
                    await RoomModel.insertMany(indexModel);
                    resolve(startRoomIndex);
                } else {
                    resolve(result.roomMaxIndex + 1);
                }
            }
        });
    });
}

RoomModel.createRoom = async (gameinfo, userInfo) => {
    let result = {state : ErrCode.Success, newRoom : null };
    if(gameinfo == null || gameinfo.gameid == 0) {
        result.state = ErrCode.ParametersError;
        return result;
    }
    const newRoomId = await RoomModel.incrementRoomId();
    let model = new RoomModel({
        roomid : newRoomId,
        id : newRoomId,
        createtime : new Date(),
        createUserName : userInfo.username,
        createUserId : userInfo.id,
        gameid : gameinfo.id,
        gameStartTime : gameinfo.gt,
        joinUser : []
    });

    const createResult = await RoomModel.insertMany(model);
    if (createResult == null) {
        result.state = ErrCode.DatabaseError;
        return result;
    }

    result.newRoom = createResult[0];
    return result;
};

RoomModel.getRoomInfo = (roomid) => {
    return RoomModel.findByRoomID(roomid);
};

// 玩家加入房间竞猜列表
RoomModel.AddJoinUser = async (roomid, userInfo, score, teamid) => {
    return new Promise((resolve, reject) => {
        RoomModel.findOneAndUpdate({roomid : roomid}, {
            $push : { joinUser : {
                userid : userInfo._id,          // 用户id
                username : userInfo.username,   // 下注用户的用户名
                teamid : teamid,                // 下注的队伍id
                score : score,                  // 下注的分数
            }}
        }, function(err, result) {
            if(err) {
                reject(err);
            } else {
                resolve(result[0]);
            }
        } )
    });
}

module.exports = RoomModel;