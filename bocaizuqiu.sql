/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50720
 Source Host           : localhost:3306
 Source Schema         : bocaizuqiu

 Target Server Type    : MySQL
 Target Server Version : 50720
 File Encoding         : 65001

 Date: 17/01/2018 10:20:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for bet
-- ----------------------------
DROP TABLE IF EXISTS `bet`;
CREATE TABLE `bet`  (
  `roomid` int(11) NOT NULL,
  `tableid` int(11) NOT NULL,
  `playerid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `rate` float NULL DEFAULT NULL COMMENT '赔率',
  `useScore` int(11) NULL DEFAULT NULL COMMENT '下注积分',
  `ctime` int(11) NULL DEFAULT NULL COMMENT '下注时间',
  `teamid` varchar(255) NULL DEFAULT NULL COMMENT '下注队伍'
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for room
-- ----------------------------
DROP TABLE IF EXISTS `room`;
CREATE TABLE `room`  (
  `roomid` int(11) NOT NULL AUTO_INCREMENT COMMENT '房间id',
  `totalScore` int(11) NULL DEFAULT NULL COMMENT '总积分',
  `roomScore` int(11) NULL DEFAULT NULL COMMENT '房间剩余积分',
  `createtime` int(11) NULL DEFAULT NULL COMMENT '创建时间',
  `ownerid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '创建者ID',
  `ownername` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '创建者昵称',
  `roomname`  varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '房间名称',
  `roomdesc`  varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '房间描述'
  PRIMARY KEY (`roomid`, `ownerid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for score
-- ----------------------------
CREATE TABLE `score` (
  `roomid` int(11) NOT NULL COMMENT '房间id',
  `playerid` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '玩家id',
  `score` int(11) DEFAULT NULL COMMENT '积分',
  `nickname` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '玩家昵称'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;


-- ----------------------------
-- Table structure for table
-- ----------------------------
DROP TABLE IF EXISTS `roomtable`;
CREATE TABLE `roomtable`  (
  `tableid` int(11) NOT NULL AUTO_INCREMENT,
  `roomid` int(11) NULL DEFAULT NULL COMMENT '房间id',
  `gamesource` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '游戏来源',
  `gameid` int(11) NULL DEFAULT NULL COMMENT '比赛编号',
  `stime` int(11) NULL DEFAULT NULL COMMENT '比赛开始时间',
  `calcStatus` int(11) NULL DEFAULT NULL COMMENT '结算状态',
  PRIMARY KEY (`tableid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Procedure structure for allocScore
-- ----------------------------
DROP PROCEDURE IF EXISTS `allocScore`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `allocScore`(
					IN 	`t_roomownerid` varchar(255),
					IN 	`t_roomid` int,
					IN 	`t_playerid` varchar(255),
					IN 	`t_score` int,
					OUT `t_ownerscore` int,
					OUT `t_playerscore` int, 
					OUT `t_result` int
)
BEGIN
	#Routine body goes here...
	DECLARE v_ownerid VARCHAR(255) DEFAULT '';
	DECLARE v_roomScore INT DEFAULT 0;
	DECLARE v_roomPlayerCount INT DEFAULT 0;
	DECLARE v_playerOldScore INT DEFAULT 0;
	
	SELECT ownerid, roomScore into @v_ownerid, @v_roomScore FROM room WHERE roomid = t_roomid;

	IF @v_ownerid = t_roomownerid AND @v_roomScore >= t_score THEN
		SET @t_result = 1;
		SET @v_roomScore := @v_roomScore - t_score;

		UPDATE room SET roomScore = @v_roomScore WHERE roomid = t_roomid;

		SELECT count(1)  into @v_roomPlayerCount  from score WHERE roomid = t_roomid AND playerid = t_playerid;

		IF @v_roomPlayerCount > 0 THEN
			UPDATE score SET score = score + t_score WHERE roomid = t_roomid AND playerid = t_playerid;
		ELSE
			INSERT INTO score (roomid, playerid, score) VALUES (t_roomid, t_playerid, t_score);
		END IF;
		
		SELECT score into @v_playerOldScore FROM score WHERE roomid = t_roomid AND playerid = t_playerid;
		SET @t_playerscore = @v_playerOldScore;
		SET @t_ownerscore = @v_roomScore;
	ELSE
		SET @t_result = 0;
	END IF;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for deallocScore
-- ----------------------------
DROP PROCEDURE IF EXISTS `deallocScore`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `deallocScore`(
				IN `t_roomownerid` varchar(255),
				IN `t_roomid` varchar(255),
				IN `t_playerid` varchar(255),
				IN `t_score` int,
				OUT `t_ownerscore` int,
				OUT `t_playerscore` int,
				OUT `t_result` int)
BEGIN
	#Routine body goes here...
	DECLARE v_ownerid VARCHAR(255) DEFAULT '';
	DECLARE v_roomScore INT DEFAULT 0;
	DECLARE v_roomPlayerCount INT DEFAULT 0;
	DECLARE v_playerOldScore INT DEFAULT 0;
	
	SELECT score into @v_playerOldScore FROM score WHERE roomid = t_roomid AND playerid = t_playerid;

	SELECT @v_ownerid;
	SELECT @v_roomScore;

	IF @v_playerOldScore >= t_score THEN
		SET @t_result = 1;

		UPDATE room SET roomScore = roomScore + t_score WHERE roomid = t_roomid;
		UPDATE score SET score = score - t_score WHERE roomid = t_roomid AND playerid = t_playerid;
		
		SELECT roomScore INTO @t_ownerscore FROM room WHERE roomid = t_roomid;
		SELECT score INTO @t_playerscore FROM score WHERE roomid = t_roomid AND playerid = t_playerid;
	ELSE
		SET @t_result = 0;
	END IF;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
