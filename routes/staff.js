const dbConnection = require('../config/connection');


module.exports = app => {
  const connection = dbConnection()
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                          ////CREATE A REQUEST
  
app.post("/request", (req, res) => {
    let ref_number= Date.now();
    let data = {id:ref_number,
    description: req.body.description,
    req_date: new Date().toISOString().slice(0, 10), 
    category: req.body.category,
    location:req.body.location,
    image:req.body.image};
  let sql = `INSERT INTO work_request SET ?`;
  connection.query(sql,data, (err, res)=> {
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
   let{feedback,rating,id}=req.body;
    const sql=`UPDATE work_request
            SET feedback= ?
                ,rating =?
            WHERE id=?`;
    connection.query(sql,[feedback,rating,id],(err,result)=>{
      if(err){
        throw err;
        res.send('Could not process feedback');
      }else{
        res.send('feedback submitted');
      } 
    })
  });
};