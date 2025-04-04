const mysql = require("mysql2");

module.exports = () => {
    return mysql.createConnection({
        host: 'sql8.freemysqlhosting.net',
        user: 'sql8649877',
        password: 'W2qpPzisg4',
        database: 'sql8649877',
        port: 3306
    });
};
