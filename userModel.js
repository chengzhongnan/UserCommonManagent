'use strict';

const setting = require('./setting');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ErrCode = require('./errcode');

mongoose.connect(setting.mongo.url, { useMongoClient: true });
mongoose.Promise = global.Promise;

const UserModelSchema = new Schema({ 
    username: String,           // 注册用户名  
    passwd: String,             // 注册密码（MD5加密，客户端传递用户输入MD5码，
                                // 服务器端对客户端的MD5码加特定字符串后再次MD5码，再与数据库比较）
    token: String,              // 登陆成功后的Token信息，生成后在第二天失效
    thirdToken: String,         // 第三方登陆Token，服务器在拿到客户端的第三方Token后，会到第三方服务器验证，验证成功生成本地Token
    money: Number,              // 用户拥有的货币
});

const UserModel = mongoose.model('user', UserModelSchema, 'user');

UserModel.findOnePromise = (cb) => {
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

UserModel.findByUserName = (userName, passWD) => {
    return UserModel.findOnePromise({ 
        username: userName,
        passwd: passWD 
    }); 
    // new Promise((resolve, reject) => {
    //     UserModel.find({ 
    //         username: userName,
    //         passwd: passWD 
    //     }, (err, res) => {
    //         if(err) {
    //           reject(undefined);
    //         } else {
    //             resolve(res[0]);
    //         }
    //     });
    // });
};

UserModel.findByToken = (token) => {
    return UserModel.findOnePromise({ 
        token: token
    });
    //  new Promise((resolve, reject) => {
    //     UserModel.find({ 
    //         token: token
    //     }, (err, res) => {
    //         if(err) {
    //           reject(undefined);
    //         } else {
    //             resolve(res[0]);
    //         }
    //     });
    // });
};

UserModel.createNewUser = async (username, passwd) => {
    let result = {state : ErrCode.Success, newUser : null };
    const findUser = await UserModel.findOnePromise({username : username});
    if (findUser != null) {
        result.state = ErrCode.UserNameRepeated;
        return result;
    }
    const newUser = new UserModelSchema({username : username, passwd : passwd});
    const createResult = await UserModel.insertMany(newUser);
    if (createResult == null) {
        result.state = ErrCode.DatabaseError;
        return result;
    }

    result.newUser = createResult;
    return result;
};

module.exports = UserModel;