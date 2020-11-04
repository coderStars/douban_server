var mysql = require('mysql');
var config = require('../config/default.js')

var pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE
});


class Mysql {
  constructor() {

  }
  query(data) {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * from user where telephone=${data.telephone} and password=${data.password} `, function (error, results, fields) {
        if (error) {
          throw error
        };
        resolve(results)
      });
    })

  }

  queryByTelePhone(data) {
    return new Promise((resolve, reject) => {
      pool.query(`SELECT * from user where telephone=${data.telephone} `, function (error, results, fields) {
        if (error) {
          throw error
        };
        resolve(results)
      });
    })

  }
}

module.exports = new Mysql()