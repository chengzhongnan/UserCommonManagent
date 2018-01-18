'use strict';

const https = require('https');
const http = require('http');
const querystring = require('querystring');
const xml2js = require('xml2js');
const xmlParser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: false });

module.exports = {
    httpget: async (host, port, path, data) => {
        return new Promise((resolve, reject) => {
            const content = querystring.stringify(data);
            const options = {
                hostname: host,
                port: port,
                path: path + '?' + content,
                method: 'GET'
            };
            let req;
            if (port == 443) {
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
    httppost: async (host, port, path, post_data) => {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: host,
                port: port,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(post_data)
                }
            };
            if (port == 443) {
                var post_req = https.request(options, function (res) {
                    let data = '';
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        data += chunk;
                    });
                    res.on('end', () => {
                        resolve(data);
                    });
                });

                post_req.on('error', function (e) {
                    reject(e);
                });
                // post the data
                post_req.write(post_data);
                post_req.end();
            } else {
                var post_req = http.request(options, function (res) {
                    let data = '';
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        data += chunk;
                    });
                    res.on('end', () => {
                        resolve(data);
                    });
                });

                post_req.on('error', function (e) {
                    reject(e);
                });
                // post the data
                post_req.write(post_data);
                post_req.end();
            }

        });
    },
    parseXML: async (xmlText) => {
        return new Promise((resolve, reject) => {
            xmlParser.parseString(xmlText, (err, result) => {
                if (err) {
                    reject(null);
                    return;
                }
                resolve(result);
            });
        });
    },
    getPostData: async (request) => {
        return new Promise((resolve, reject) => {
            let body = '';
            request.on('data', function (data) {
                body += data;
                if (body.length > 1e7) {
                    request.connection.destroy();
                    reject(null);
                }
            });
            request.on('end', function () {
                resolve(body);
            });
        })
    }
};