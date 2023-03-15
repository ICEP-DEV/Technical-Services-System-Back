const mysql = require("mysql");

module.exports = () => {
return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'techservices',
    port:3306
});

/*db.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
  });*/
}