const mysql = require("mysql");
const express = require("express");
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyparser.json());


const staffRoute = require("../routes/Staff");

app.use('/Staff',staffRoute);

const db = mysql.createConnection({
  host: 'localhost',
  user:'root',
  password:'',
  database:'techservices',
  port:3306
});

//check dataabse connection

module.exports = () => {
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'techservices',
    port:3306
});

db.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
  });
}