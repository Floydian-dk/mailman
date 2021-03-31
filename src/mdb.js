const mariadb = require('mariadb');
const mdbpool = mariadb.createPool({
 host: process.env.MAILMAN_DB_HOST,
 user: process.env.MAILMAN_DB_USER,
 password: process.env.MAILMAN_DB_PASSWORD,
 database: process.env.MAILMAN_DB_DATABASE,
 connectionLimit: 5
});

module.exports = {
  getConnection() {
    return new Promise(function (res, rej) {
      mdbpool.getConnection()
        .then(function (conn) {
          res(conn);
        })
        .catch(function (error) {
          rej(error);
        });
    });
  }
};
