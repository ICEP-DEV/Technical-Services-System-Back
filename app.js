const app=require('./routes/server');
require('./routes/admin')(app);
require('./routes/staff')(app);
require('./routes/technician')(app);

app.listen(app.get('port'),()=>{
    console.log('Server running on port',app.get('port'));
});
