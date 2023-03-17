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
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                          ////CREATE A REQUEST
  
  app.post("/request", (req, res) => {
    let { id,description,date, category,priority,location,image } = req.body;
    req.body.date=new date().toISOString().slice(0, 10);/////The curennt date to be added to database
    req.body.id=Date.now();////The creation of a unique id 
    const sql= `INSERT INTO work_request (id,description,date, category,priority,location,image)
    VALUES ('${id},${description}','${date}', '${category}','${priority}','${location}','${image}')`;
    connection.query(sql, (err, res)=> {
      if(err){
        throw err;
        res.send('Could not submitted a request');
      }else{
        res.send('Work request submitted');
      }
   })
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                            ///STAFF SENDING FEEDBACK///
  app.post("/feedback",(req,res)=>{
   let{feedback,technician}=req.body;
    const sql=`INSERT INTO staff_feedback(feedback,tech_rating) VALUES ('${feeback}','${tech_rating}')`;
    connection.query(sql,(err,result)=>{
      if(err){
        throw err;
        res.send('Could not process feedback');
      }else{
        res.send('feedback submitted');
      } 
    })
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
};

