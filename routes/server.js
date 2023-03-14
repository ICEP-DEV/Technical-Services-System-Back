const express = require('express');
const bodyParser =require('body-parser');
const { application } = require('express');

const app=express();

app.set('port',process.env.PORT||3000);
app.use(bodyParser.urlencoded({extended:false}));
//app.use(expres.static(path.join()))
