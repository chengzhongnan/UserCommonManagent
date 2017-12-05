'use strict';

const https = require('https');
const http = require('http');
const querystring = require('querystring');

module.exports = {
    httpget : async (host, port, path, data) => {
        return new Promise((resolve, reject) => {
            const content = querystring.stringify(data);
            const options = {    
                hostname: host,
                port : port,   
                path: path + '?' + content,    
                method: 'GET'    
            };
            let req; 
            if(port == 443) {
                req = https.request(options, function (res) {    
                    res.setEncoding('utf8');    
                    res.on('data', function (chunk) {    
                        resolve(chunk);    
                    });    
                });
            } else {
                req = http.request(options, function (res) {    
                    res.setEncoding('utf8');    
                    res.on('data', function (chunk) {    
                        resolve(chunk);    
                    });    
                });
            }    
                
            req.on('error', function (e) {    
                reject(e);    
            });    
                
            req.end();  
        });
    }
};