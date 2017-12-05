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
            token : { type : Number },      // 登陆状态
        },
        returns : {

        }
    },
    CreateRoom : {                          // 创建一个房间
        path : '/user/room/create',
        parameters : {

        },
        returns : {

        }
    },
    GetParticipateRoom : {                  // 取得参与的房间
        path : '/user/participate/room',
        parameters : {

        },
        returns : {

        }
    },
    GetMacauslotBallGameList : {
        path : '/user/macauslot/gamelist',
        parameters : {
            token : {type : String}
        },
        returns : {

        }
    }
};