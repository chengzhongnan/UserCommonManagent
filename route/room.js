'use strict';

const router = require('../router');
const bluebird = require('bluebird');
const fs = require('fs');
const Busboy = require('async-busboy');
const ObjectID = require('mongodb').ObjectID;

const userSession = require('../usersession');
const routerPath = require('../routepath');
const ErrCode = require('../errcode');
const ballGame = require('../ballgame');
const RoomModel = require('../roomModel');
const setting = require('../setting');
const roomMysql = require('../roomSQLModel');

// 创建竞猜房间
// router.get(routerPath.CreateRoom.path , async (ctx) => {
//     let createResult = { state : ErrCode.Success };
//     // 检查比赛id，无效的比赛id或比赛已经开始，返回参数错误
//     const selectedBallGame = ballGame.getMacauslotBallGame(ctx.query.ballgameid);
//     if(selectedBallGame == null || selectedBallGame.gt > (new Date())) {
//         createResult.state = ErrCode.ParametersError;
//         ctx.body = createResult;
//         return;
//     }

//     const newRoom = await RoomModel.createRoom(selectedBallGame, ctx.userInfo);
//     if (newRoom == null) {
//         createResult.state = ErrCode.DatabaseError;
//         ctx.body = createResult;
//         return;
//     }

//     createResult.roomid = newRoom.newRoom.roomid;
//     createResult.createtime = new Date();
//     createResult.ballgameid = ctx.query.ballgameid;
//     createResult.statetime = selectedBallGame.gt;

//     ctx.body = createResult;
// });

// // 加入竞猜房间
// router.get(routerPath.JoinRoom.path, async (ctx) => {
//     let joinResult = { state : ErrCode.Success };
//     // 比赛房间数据
//     const roominfo = await RoomModel.getRoomInfo(ctx.query.roomid);
//     if(roominfo == null) {
//         joinResult.state = ErrCode.ParametersError;
//         ctx.body = joinResult;
//         return;
//     }

//     // 比赛数据
//     const selectedBallGame = ballGame.getMacauslotBallGame(roominfo.gameid);
//     if(selectedBallGame == null || selectedBallGame.gt > (new Date())) {
//         joinResult.state = ErrCode.BallgameExpriesed;
//         ctx.body = joinResult;
//         return;
//     }

//     const findUser = roominfo.joinUser.find(x => {
//         return x.userid.toString() == ctx.userInfo._id.toString()});
//     // 如果已经加入房间，那么不可再次加入
//     if ( findUser != null) {
//         joinResult.state = ErrCode.CannotJoinGameRepeat;
//         ctx.body = joinResult;
//         return;
//     }

//     // 检查积分参数
//     if (ctx.query.score >= setting.gamesetting.maxroomscore ) {
//         joinResult.state = ErrCode.GameRoomScoreLimit;
//         ctx.body = joinResult;
//         return;
//     }

//     // 加入到房间竞猜列表
//     const joindata = await RoomModel.AddJoinUser(ctx.query.roomid, ctx.userInfo, 
//         ctx.query.score, ctx.query.team);
//     joinResult.data = joindata;

//     // 加入到用户自身竞猜列表中
//     await (new UserSession()).addJoinRoomRecord(ctx.userInfo._id, ctx.query.roomid, 
//         ctx.query.team, ctx.query.score, selectedBallGame.gt);

//     ctx.body = joinResult;
// });

// // 获取参与的竞猜房间
// router.get(routerPath.GetParticipateRoom.path, async (ctx) => {
//     ctx.body = ctx.userInfo.joinRecord;
// });


// 创建竞猜房间
router.get(routerPath.CreateRoom.path , async (ctx) => {
    let createResult = { state : ErrCode.Success };

    const newRoomid = await roomMysql.createRoom(ctx.userInfo._id, ctx.userInfo.username, 10000);
    if (newRoomid == -1) {
        createResult.state = ErrCode.CreateRoomLimit;
        ctx.body = createResult;
        return;
    }

    createResult.roomid = newRoomid;
    createResult.createtime = new Date();

    ctx.body = createResult;
});

// 分配积分
router.get(routerPath.allocScore.path , async(ctx) => {
    let createResult = { state : ErrCode.Success };
    const roomInfo = await roomMysql.getRoomByOwner(ctx.userInfo._id);
    if (roomInfo == null) {
        createResult.state = ErrCode.NoRoom;
        ctx.body = createResult;
        return;
    }

    const score = parseInt(ctx.query.score);
    if(score > roomInfo.roomscore) {
        createResult.state = ErrCode.RoomScoreNotEnought;
        ctx.body = createResult;
        return;
    }

    const allocScore = await roomMysql.allocRoomScore(ctx.userInfo._id, roomInfo.roomid, score, ctx.query.playerid);
    if(!allocScore) {
        createResult.state = ErrCode.AllocScoreFail;
        ctx.body = createResult;
        return;
    }

    ctx.body = createResult;
})

// 创建下注桌子
router.get(routerPath.createTable.path, async(ctx) => {
    let createResult = { state : ErrCode.Success };
    const roomInfo = await roomMysql.getRoomByOwner(ctx.userInfo._id);
    // 检查房间信息
    if (roomInfo == null) {
        createResult.state = ErrCode.NoRoom;
        ctx.body = createResult;
        return;
    }

    // 检查比赛信息
    const gameinfo = ballGame.getMacauslotBallGame(ctx.query.gameid);
    if (gameinfo == null) {
        createResult.state = ErrCode.BallgameExpriesed;
        ctx.body = createResult;
        return;
    }

    const gtSplitReg = /(\d{4})(\d{2})(\d{2})\s*(\d{1,2})\:(\d{1,2})/;
    const stimeSplit = gtSplitReg.exec(gameinfo.gt);
    const gamestarttime = new Date(stimeSplit[1],stimeSplit[2],stimeSplit[3],stimeSplit[4],stimeSplit[5],0);
    // 创建桌子
    const tableid = await roomMysql.createTable(roomInfo.roomid, 'macauslot', gameinfo.id, gamestarttime/1000 );
    if (tableid == -1) {
        createResult.state = ErrCode.CreateRoomTableFail;
        ctx.body = createResult;
        return;
    }

    createResult.tableid = tableid;
    ctx.body = createResult;
});

router.get(routerPath.betGame.path, async(ctx) => {
    
});

router.get(routerPath.UserEnterRoom.path, async(ctx) => {
    const roomid = parseInt(ctx.query.roomid);
    const roomData = roomMysql.getRoomPlayers(roomid);
    ctx.body = roomData;
});

router.get(routerPath.GetRoomPlayer.path, async(ctx) => {
    let enterResult = { state : ErrCode.Success };
    const roomid = parseInt(ctx.query.roomid);
    const roominfo = roomMysql.getRoom(roomid);
    if (roominfo == null) {
        enterResult.state = ErrCode.RoomInvalid;
        ctx.body = enterResult;
        return;
    }

    await roomMysql.playerEnterRoom(roomid, ctx.userInfo._id, ctx.userInfo.nickname);
    ctx.body = enterResult;
});