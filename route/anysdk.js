'use strict';

const router = require('../router');
const routePath = require('../routepath');
const busboy = require('async-busboy');
const http = require("http");
const util = require('../util');
const userSession = require('../usersession');

const dispatchResponse = async (respData) => {
    console.log(respData);
    if (respData.common.channel == '000000') {
        return await weixinResponse(respData);
    }

    return respData;
}

const weixinResponse = async (respData) => {
    
    // const testdata = {
    //     "status": "ok", 
    //     "data": { 
    //         "access_token": "5_m044uwFMVAs9NK-9dUeT2Bs7JDKHnbcHzVT8BDSRZGCvZX5XfYx_dXyUriVBDYggJvUWqJWY7kpH43KPUUzVK1HR6mN4YK7GNfT24kE68lc", 
    //         "expires_in": 7200, 
    //         "refresh_token": "5_I2Obw3CWIBESkmHSMaT8rDXPa8shxMJY9sDJgNpcjsuC9HMiFzjCMoZ8eujDTKukglShoVrCYrbev5KU1Y3NDysLyoGoV-NKTAjVU-79Syg", 
    //         "openid": "oyRIB1i3mIkQaMfLHgrGDOijJ6cg", 
    //         "scope": "snsapi_userinfo", 
    //         "unionid": "oHGYY1OCQIUAoFoZg6cbQCyBpIho", 
    //         "user_info": { 
    //             "openid": "oyRIB1i3mIkQaMfLHgrGDOijJ6cg", 
    //             "nickname": "Lessy", 
    //             "sex": 2, 
    //             "language": "zh_CN", 
    //             "city": "", 
    //             "province": "", 
    //             "country": "CN", 
    //             "headimgurl": "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLyV5tZ5Sa9PTHIg95sNlm8DuQpzXibyA1JtgesCUuLKX8h38ibgyYnSOrJOLRibl75lcTtNIfR6hkSw/132", 
    //             "privilege": [], 
    //             "unionid": "oHGYY1OCQIUAoFoZg6cbQCyBpIho" 
    //         } 
    //     }, 
    //     "common": { 
    //         "channel": "000000", 
    //         "user_sdk": "wxpay", 
    //         "uid": "oyRIB1i3mIkQaMfLHgrGDOijJ6cg", 
    //         "server_id": "1", 
    //         "plugin_id": "387" 
    //     }, 
    //     "ext": ""
    // }

    const findUserToken = await userSession.findUserByWeixinOpenid(respData.data.openid, 
                                    respData.data.access_token, 
                                    respData.data.refresh_token, 
                                    respData.data.user_info.headimgurl);
    if (findUserToken == null) {
        respData.ext = await userSession.createUserByWeixin(respData);
    } else {
        respData.ext = findUserToken;
    }

    return respData;
}

router.post(routePath.anysdkCallback.path, async (ctx) => {
    const oauth_host = "oauth.anysdk.com";
    const oauth_path = "/api/User/LoginOauth/";
    const postData = await util.getPostData(ctx.req);

    console.log('anysdk callback : ' + JSON.stringify(postData));

    const resp = await util.httppost(oauth_host, 80, oauth_path, postData);

    const loginResp = await dispatchResponse(JSON.parse(resp));

    ctx.body = loginResp;
})