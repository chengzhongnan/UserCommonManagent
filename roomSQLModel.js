'use strict';

const mysqlConn = require('./mysqlConnect');

class RoomMysqlModel {

    /**
     * 创建房间
     * @param {创建者id} ownerid 
     * @param {创建者名字} ownerName 
     * @param {初始积分} totalScore 
     * @returns {创建好的房间id，-1表示创建失败}
     */
    async createRoom(ownerid, ownerName, totalScore) {
        // 每人仅仅允许创建一个房间
        const findSql = `select count(1) from room where ownerid = '${ownerid}'`;
        const findRes = await mysqlConn.queryAsync(findSql);
        if (findRes.res[0][findRes.fields[0].name] >= 1) {
            return -1;
        }

        // 插入到数据库中
        const sql = `insert into room  
                (totalscore, roomscore, createtime, ownerid, ownername) values 
                (${totalScore}, ${totalScore}, ${Date.now() / 1000 >> 0}, 
                '${ownerid}', '${(new Buffer(ownerName)).toString('base64')}')`;
        const res = await mysqlConn.queryAsync(sql);
        return res.res.insertId;
    }

    /**
     * 获取房间信息
     * @param {房间id} roomid 
     */
    async getRoom(roomid) {
        const sql = `select roomid, totalscore, roomscore, createtime, ownerid, ownername from room where roomid = ${ownerid}`;
        const res = await mysqlConn.queryAsync(sql);
        if(res.res.length >= 1) {
            return res.rows[0];
        } else {
            return null;
        }
    }

    async getTable(tableid) {
        const sql = `select gamesource, gameid, stime, calcstatus from roomtable where tableid = ${tableid}`;
        const res = await mysqlConn.queryAsync(sql);
        if (res.res.length >= 1) {
            return res.res[0];
        } else {
            return null;
        }
    }

    async getPlayerScore(roomid, playerid) {
        const sql = `select score from score where roomid = ${roomid} and `
    }

    /**
     * 获取房间信息
     * @param {创建者id} ownerid 
     */
    async getRoomByOwner(ownerid) {
        const sql = `select roomid, totalscore, roomscore, createtime, ownerid, ownername from room where ownerid = '${ownerid}'`;
        const res = await mysqlConn.queryAsync(sql);
        if(res.res.length >= 1) {
            return res.res[0];
        } else {
            return null;
        }
    }

    /**
     * 给玩家分配房间积分
     * @param {创建者id} ownerid 
     * @param {房间id} roomid 
     * @param {分配积分} score 
     * @param {被分配的玩家} playerid 
     * @returns {分配成功后的数据}
     */
    async allocRoomScore(ownerid, roomid, score, playerid) {
        if (score <= 0) {
            return false;
        }
        const sql = `call allocScore('${ownerid}', ${roomid}, '${playerid}', ${score}, @ownerscore, @playerscore, @result)`;
        const res = await mysqlConn.queryAsync(sql);
        return res;
    }

    /**
     * 创建比赛桌
     * @param {房间id} roomid 
     * @param {比赛来源} gamesrc 
     * @param {比赛id} gameid 
     * @param {开始时间} starttime 
     * @returns {创建的桌子id}
     */
    async createTable(roomid, gamesrc, gameid, starttime) {
        const findTableSql = `select tableid from roomtable where roomid = ${roomid} and gameid = ${gameid}`;
        const findTable = await mysqlConn.queryAsync(findTableSql);
        if (findTable.res.length > 0) {
            return findTable.res[0];
        }
        const sql = `insert into roomtable  
                (roomid, gamesource, gameid, stime, calcStatus) values 
                (${roomid}, '${gamesrc}', ${gameid}, ${starttime}, 0)`;
        const res = await mysqlConn.queryAsync(sql);
        return res.res.insertId;
    }

    /**
     * 
     * @param {房间id} roomid 
     * @param {比赛桌子id} tableid 
     * @param {玩家} playerid 
     * @param {赔率} rate 
     * @param {下注积分} betScore 
     * @param {下注队伍} teamid 
     */
    async betGameTable(roomid, tableid, playerid, rate, betScore, teamid) {
        const roomInfo = await this.getRoom(roomid);

        const playerScoreSql = `select `
    }

    /**
     * 取得房间所有玩家
     * @param {房间id} roomid 
     */
    async getRoomPlayers(roomid) {
        const sql = `select playerid, score, nickname from score where roomid = ${roomid}`;
        const res = await mysqlConn.queryAsync(sql);
        return res;
    }

    /**
     * 玩家进入房间
     * @param {房间id} roomid 
     * @param {玩家id} playerid 
     * @param {玩家昵称} nickname 
     */
    async playerEnterRoom(roomid, playerid, nickname) {
        const findPlayerSql = `select count(1) from score where roomid = ${roomid} and playerid = '${playerid}'`;
        const res = await mysqlConn.queryAsync(findPlayerSql);
        if (res == 0) {
            const insertPlayerSql = `insert into score (roomid, playerid, score, nickname) values (${roomid}, '${playerid}', 0, '${nickname}')`;
            await mysqlConn.queryAsync(insertPlayerSql);
        }
    }
}

const ins = new RoomMysqlModel();

module.exports = ins;