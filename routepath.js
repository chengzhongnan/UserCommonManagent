'use strict';

module.exports = {
    Root : {
        path: /\/user\/.*/,
    },
    CreateUser : {
        path: '/create',
        parameters : {
            username : { type : String },
            password : { type : String },
            nickname : { type : String } // 昵称
        },
        returns : {
            state : { type : Number },
        }
    },
    Login : {
        path: '/user/login',
        parameters : {
            username : { type : String },
            password : { type : String }
        },
        returns : {
            state : { type : Number },      // 登陆状态
            token : { type : String },      // 成功后返回登陆token，其他返回空值
        }
    },
    GetUserInfo : {                         // 取得用户信息
        path: '/user/getinfo',
        parameters : {
            token : { type : String }
        },
        returns : {
            state : { type : Number },      // 登陆状态
            nickname : { type : String },   // 昵称
            money : { type : Number },      // 拥有货币
            headimage : { type : String }   // 图像
        }
    },

    ChangeImage : {                         // 修改默认图像
        path: '/user/changeheadimg',
        method : 'post',
        parameters : {
            token : { type : String },
            img : { type : 'Stream' },
        },
        returns : {
            state : { type : Number },      // 登陆状态
            headpic : { type : String }     // 上传成功后的pic 
        }
    },

    GetBallGameList : {                     // 取得球赛列表
        path : '/user/game/list',
        parameters : {
            token : { type : String },      // 登陆状态
        },
        returns : {
            state : { type : Number },
        }
    },
    CreateRoom : {                          // 创建一个房间
        path : '/user/room/create',
        parameters : {
            token : { type : String },      // 登陆状态
        },
        returns : {
            state : { type : Number},
            roomid : { type : Number},      // 房间id
            createtime : {type : String},   // 创建时间
        }
    },
    GetParticipateRoom : {                  // 取得参与的房间
        path : '/user/participate/room',
        parameters : {
            token : { type : String },      // 登陆状态
        },
        returns : {
            state : {type : Number},
            roomcount : {type : Number},    // 已经参数的房间数量列表
            rooms : {
                type : Array, 
                obj : {
                    roomid : {type : Number},
                    roomname : {type : String},
                    createtime : {type : String}
                }
            }
        }
    },
    GetMacauslotBallGameList : {            // 取得球赛列表
        path : '/user/macauslot/gamelist',
        parameters : {
            token : {type : String}
        },
        returns : {
            state : {type : Number},
            games : {type : Array,
                obj : {

                }
            }
        }
    },

    GetRoomInfo : {
        path : '/user/getroominfo',         // 取得房间信息
        parameters : {

        },
        returns : {
            state : {type : Number},
        }
    },
    testBallGame : {
        path : '/user/ballgame/test',       // 使用测试数据更新球赛信息
        parameters : {
            
        },
        returns : {
            state : {type : Number},
        }
    },
    getWeixinWebLoginUrl : {
        path : '/get/weixin/weburl',
        parameters : {},
        returns : {
            state : {type : String},
            url : {type : String},
        }
    },
    allocScore : {                          // 分配积分
        path : '/user/alloc/score',
        parameters : {
            token : {type : String},
            playerid : {type : String},
            score : {type : Number},
        },
        returns : {
            state : {type : String},
            roomScore : {type : Number},
            playerScore : {type : Number},
        }
    },
    createTable : {                         // 创建桌子
        path : '/user/create/table',
        parameters : {
            token : {type : String},
            gameid : {type : String},
        },
        returns : {
            state : {type : String},
            tableid : {type : Number},
        }
    },
    betGame : {
        path : '/user/bet',                 // 下注
        parameters : {
            token : {type : String},        
            tableid : {type : Number},      // 桌子id
            score : {type : Number},        // 下注积分
            team : {type : String},         // 下注队伍
        },
        returns : {
            state : {type : String},
        }
    },
    anysdkCallback : {                      // AnySDK回调
        path : '/anysdk/login',
        parameters : {
        },
        returns : {
        }
    },
    GetRoomPlayer : {                           // 取得房间用户
        path : '/user/get/roomplayer',
        parameters : {
            token : {type : String},
            roomid : {type : Number},
        },
        returns : {
            state : {type : String},
            data : [{
                userid : {type : String},       // 玩家ID
                nickname : {type : String},     // 玩家昵称
                score : {type : Number},        // 玩家分数
            }]
        }
    },
    UserEnterRoom : {                           // 用户进入房间
        path : '/user/enter/room',              
        parameters : {
            token : {type : String},
            roomid : {type : Number},
        },
        returns : {
            state : {type : String}
        }
    }
};