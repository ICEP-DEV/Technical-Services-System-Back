const express = require('express');
const bodyParser =require('body-parser');
const { application } = require('express');

const app=express();

app.set('port',3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

module.exports=app;