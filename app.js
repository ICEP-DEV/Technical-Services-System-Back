const app=require('./routes/server');
const cors=require('cors');
require('./routes/admin')(app);
require('./routes/staff')(app);
require('./routes/technician')(app);
app.use(cors());
app.listen(app.get('port'),()=>{
    console.log('Server running on port',app.get('port'));
});
