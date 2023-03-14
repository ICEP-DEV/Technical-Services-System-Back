const mysql = require("mysql");

module.exports = () => {
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'techservices',
});

db.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
  });
}