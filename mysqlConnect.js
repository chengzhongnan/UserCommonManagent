'use strict';

const mysql = require('mysql');
const setting = require('./setting');

const connection = mysql.createConnection(setting.mysql);

connection.connect((err) => {
    if(err) {
        console.log('mysql error : ' + err);
        return;
    }
    console.log('mysql connect success!');
});

connection.queryAsync = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, rows, fields) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                res : rows,
                fields : fields,
            });
        })
    })
}

module.exports = connection;