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
    joinUser: [Schema.Types.ObjectId],  // 参与的玩家ObjectID
});

const RoomModel = mongoose.model('room', RoomModelSchema, 'room');

RoomModel.findOnePromise = (cb) => {
    return new Promise((resolve, reject) => {
        UserModel.find(cb, (err, res) => {
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
        Sequence.increment('room',function (err, result) {
            if (err) 
            {
                reject(0);
            }
            else
            {
                resolve(result.value.next);
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
        createtime : new Date(),
        createUserName : userInfo.username,
        createUserId : userInfo.id,
        gameid : gameinfo.id,
        gameStartTime : starttime,
    });

    const createResult = await RoomModel.insertMany(model);
    if (createResult == null) {
        result.state = ErrCode.DatabaseError;
        return result;
    }

    result.newRoom = createResult;
    return result;
};

module.exports = RoomModel;