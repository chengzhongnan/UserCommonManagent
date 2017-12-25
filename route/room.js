'use strict';

const router = require('../router');
const bluebird = require('bluebird');
const fs = require('fs');
const Busboy = require('async-busboy');
const ObjectID = require('mongodb').ObjectID;

const UserSession = require('../usersession');
const routerPath = require('../routepath');
const ErrCode = require('../errcode');
const ballGame = require('../ballgame');
const RoomModel = require('../roomModel');
const setting = require('../setting');

// 创建竞猜房间
router.get(routerPath.CreateRoom.path , async (ctx) => {
    let createResult = { state : ErrCode.Success };
    // 检查比赛id，无效的比赛id或比赛已经开始，返回参数错误
    const selectedBallGame = ballGame.getMacauslotBallGame(ctx.query.ballgameid);
    if(selectedBallGame == null || selectedBallGame.gt > (new Date())) {
        createResult.state = ErrCode.ParametersError;
        ctx.body = createResult;
        return;
    }

    const newRoom = await RoomModel.createRoom(selectedBallGame, ctx.userInfo);
    if (newRoom == null) {
        createResult.state = ErrCode.DatabaseError;
        ctx.body = createResult;
        return;
    }

    createResult.roomid = newRoom.newRoom.roomid;
    createResult.createtime = new Date();
    createResult.ballgameid = ctx.query.ballgameid;
    createResult.statetime = selectedBallGame.gt;

    ctx.body = createResult;
});

// 加入竞猜房间
router.get(routerPath.JoinRoom.path, async (ctx) => {
    let joinResult = { state : ErrCode.Success };
    // 比赛房间数据
    const roominfo = await RoomModel.getRoomInfo(ctx.query.roomid);
    if(roominfo == null) {
        joinResult.state = ErrCode.ParametersError;
        ctx.body = joinResult;
        return;
    }

    // 比赛数据
    const selectedBallGame = ballGame.getMacauslotBallGame(roominfo.gameid);
    if(selectedBallGame == null || selectedBallGame.gt > (new Date())) {
        joinResult.state = ErrCode.BallgameExpriesed;
        ctx.body = joinResult;
        return;
    }

    const findUser = roominfo.joinUser.find(x => {
        return x.userid.toString() == ctx.userInfo._id.toString()});
    // 如果已经加入房间，那么不可再次加入
    if ( findUser != null) {
        joinResult.state = ErrCode.CannotJoinGameRepeat;
        ctx.body = joinResult;
        return;
    }

    // 检查积分参数
    if (ctx.query.score >= setting.gamesetting.maxroomscore ) {
        joinResult.state = ErrCode.GameRoomScoreLimit;
        ctx.body = joinResult;
        return;
    }

    // 加入到房间竞猜列表
    const joindata = await RoomModel.AddJoinUser(ctx.query.roomid, ctx.userInfo, 
        ctx.query.score, ctx.query.team);
    joinResult.data = joindata;

    // 加入到用户自身竞猜列表中
    await (new UserSession()).addJoinRoomRecord(ctx.userInfo._id, ctx.query.roomid, 
        ctx.query.team, ctx.query.score, selectedBallGame.gt);

    ctx.body = joinResult;
});

// 获取参与的竞猜房间
router.get(routerPath.GetParticipateRoom.path, async (ctx) => {
    ctx.body = ctx.userInfo.joinRecord;
});