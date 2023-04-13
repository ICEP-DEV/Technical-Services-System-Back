const dbConnection = require('../config/connection');


module.exports = app => {
  const connection = dbConnection();
 
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                        ///VIEW ALL REQUESTS
  app.get("/request", (req, res) => {
    sql='SELECT * FROM work_request';
    connection.query(sql, (err, result) => {
      if(err)
      {
          console.log(err,'errs');
      }
      if(result.length>0)
      {
          res.send({
              message:'all user data',
              data:result
          });
      }
    });
  });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        ////THE ADIM SETS THE PRIOTY OF THE REQUEST

app.put("/setPriority/:id",(req,res)=>{
  const sql="UPDATE work_request SET priority=? WHERE id=?";
  connection.query(sql,(err,result)=>{
    if(err){
      console.log(err.message);
      throw err;
  }
  res.send(201, req.body); 
  })
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                          ////VIEWING A SPECIFIC REQUEST
app.get("/request/:id",(req,res)=>{
    connection.query('SELECT * FROM work_request WHERE id = ?',req.body.id,(err,result)=>{
      if(err){
        console.log(err.message);
        throw err;
    }
    res.send(result);
    })
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                                       VIEW AVAILABLE TECHNICIANS*/
app.get('/technician',(req,res)=>{
  const sql="SELECT name, surname FROM technician WHERE availability='available'";
  connection.query(sql,(err,result)=>{
    if(err){
      console.log(err.message);
      throw err;
  }
  res.send(result);
  })
})            

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                     /*ASSIGN A TECHNICIAN*/
app.post('/assign',(res,req)=>{
  const sql="UPDATE work_request SET tech_id=?";
  connection.query(sql,(err,result)=>{
    if(err){
      throw err;
    }
    res.send(result);
  })
  })
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**                                          VIEW TECHNICIAN PROGRESS                                                      */
 app.get('/progresStatus',(req,res)=>{
  const sql ="SELECT a.id,a.progress FROM work_request a, technician t WHERE a.tech_id = t.id;";
  connection.query(sql,(err,result)=>{
    if(err){
      throw err;
    }
    res.send(result);
  })
 }) 

};


