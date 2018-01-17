'use strict';

const setting = require('./setting');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ErrCode = require('./errcode');
const roomModel = require('./roomModel');
const ballGame = require('./ballgame');

class RoomSession {
    constructor() {

    }

    async incrementRoomId() {
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

    /**
     * 创建房间
     * @param {玩家信息} userInfo 
     * 创建成功返回房间的db数据
     */
    async createRoom(userInfo) {
        let result = {state : ErrCode.Success, newRoom : null };
        
        const newRoomId = await this.incrementRoomId();
        let model = new RoomModel({
            id: newRoomId, 
            roomid: newRoomId,
            createtime: new Date(),
            createUserName : userInfo.username,
            createUserId :userInfo._id,
            password : '',
            games : [],
            totalScore : setting.gamesetting.maxroomscore,
            roomPlayers : []
        });

        const createResult = await RoomModel.insertMany(model);
        if (createResult == null) {
            result.state = ErrCode.DatabaseError;
            return result;
        }

        result.newRoom = createResult[0];
        return result;
    }

    /**
     * 取得房间信息
     * @param {房间id} roomid 
     */
    async getRoomInfo(roomid) {
        return await RoomModel.findByRoomID(roomid);
    }

    /**
     * 创建新的比赛桌
     * @param {房间id} roomid 
     * @param {用户信息，必须为房主} userInfo 
     * @param {球赛id} gameid 
     */
    async createGame(roomid, userInfo, gameid) {
        const room = this.getRoomInfo(roomid);
        if (room == null || room.createUserId != userInfo._id ) {
            // 没有权限创建比赛
            return null;
        }

        if (room.games.find((x) => x.gameid == gameid)) {
            // 已经有这场比赛了
            return null;
        }

        const gameinfo = ballGame.getMacauslotBallGame(gameid);
        if (gameinfo == null) {
            // 没有比赛了
            return null;
        }

        const gamedb = {
            gameid : gameid,
            gameStartTime: gameinfo.gt,
            createTime : new Date(),
            isSettlement : false,
            joinUser: []
        };

        // 增加桌子到数据库中
        const updateData = await roomModel.updatePromise({roomid : roomid}, {
            $push : {games : gamedb}
        });

        return updateData;
    }

    async addRoomPlayer(roomid, userid) {

    }

    /**
     * 房主给房间内的玩家分配分数
     * @param {房间id} roomid 
     * @param {房主id} ownerid 
     * @param {玩家id} userid 
     * @param {分数} score 
     */
    async allocateScore(roomid, ownerid, userid, score) {
        const room = roomModel.getRoomInfo(roomid);
        if (room == null || room.createUserId != ownerid) {
            // 没有权限
            return false;
        }

        let roomPlayer = room.roomPlayers.find(x => x.userid == userid);
        if(roomPlayer == null) {
            // 没有找到玩家，加入
            roomPlayer = await this.addRoomPlayer(roomid, userid);
        }

        // 检查房主分数是否足够
        if (room.totalScore < score) {
            return false;
        }

        // 更新数据库
        let updateResult = await roomModel.updatePromise({roomid : roomid}, {
            $inc : {totalScore : -score}
        });
        
    }

    /**
     * 玩家加入房间竞猜列表
     * @param {房间id} roomid 
     * @param {参与的玩家} userInfo 
     * @param {游戏id(第三方)} gameid
     * @param {桌子id} gametable
     * @param {分数} score 
     * @param {押注的队伍id} teamid 
     */
    async addJoinUser(roomid, userInfo, gameid, gametable, score, teamid) {

    }


}

const roomSession = new RoomSession();
module.exports = roomSession;