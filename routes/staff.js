const dbConnection = require('../config/connection');


module.exports = app => {
  const connection = dbConnection()
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                          ////CREATE A REQUEST
  
app.post("/createRequest", (req, res) => {
    let ref_number= Date.now();
    let data = {id:ref_number,
    description: req.body.description,
    req_date: new Date().toISOString().slice(0, 10), 
    category: req.body.category,
    location:req.body.location,
    image:req.body.image};
  let sql = `INSERT INTO work_request SET ?`;
  connection.query(sql,data, (err,res)=> {
     if(err){
     throw err;
      }else{
        res.send('Work request submitted');
     }
  })
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                            ///VIEW PROGRESS OF RERQUEST///
app.get('/progresStatus',(req,res)=>{
  let ref_number=req.body.ref_number;
  const sql=`SELECT id,progess FROM work_request WHERE id= "${ref_number}"`;
  connection.query(sql,(err,res)=>{
    if(err){
      throw err;
       }else{
         res.send(result);
      }
  })
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                            ///STAFF SENDING FEEDBACK///
  app.post("/feedback",(req,res)=>{
   let{staff_feedback,rating,id}=req.body;
    const sql=`UPDATE work_request
            SET staff_feedback= ?
                ,rating =?
            WHERE id=?`;
    connection.query(sql,[staff_feedback,rating,id],(err,result)=>{
      if(err){
        res.send('Could not process feedback');
      }else{
        res.send('Feedback submitted');
      } 
    })
  });
};