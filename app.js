const app=require('./routes/server');
require('./routes/admin')(app);

app.listen(app.get('port'),()=>{
    console.log('Server running on port',app.get('port'));
});
