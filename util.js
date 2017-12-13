'use strict';

const https = require('https');
const http = require('http');
const querystring = require('querystring');
const xml2js = require('xml2js');
const xmlParser = new xml2js.Parser( { explicitArray : false, ignoreAttrs : false });

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
                    let data = '';    
                    res.setEncoding('utf8');    
                    res.on('data', function (chunk) {    
                        data += chunk;    
                    });    
                    res.on('end', () => {
                        resolve(data);
                    });
                });
            } else {
                req = http.request(options, function (res) {    
                    let data = '';    
                    res.setEncoding('utf8');    
                    res.on('data', function (chunk) {    
                        data += chunk;    
                    });    
                    res.on('end', () => {
                        resolve(data);
                    });    
                });
            }    
                
            req.on('error', function (e) {    
                reject(e);    
            });    
                
            req.end();  
        });
    },
    parseXML : async (xmlText) => {
        return new Promise((resolve, reject) => {
            xmlParser.parseString(xmlText, (err, result) => {
                if(err) {
                    reject(null);
                    return;
                }
                resolve(result);
            });
        });
    }
};