const { body } = require('express-validator');
const dbConnection = require('../config/connection');


module.exports = app => {
  const connection = dbConnection();
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                          ////CREATE A REQUEST
  
app.post("/staff/createRequest", (req, res) => {
    let ref_number= Date.now();
    let data = {id:ref_number,
    description: req.body.description,
    req_date: new Date().toISOString().slice(0, 10), 
    category: req.body.category,
    venue:req.body.venue,
    image:req.body.image,
    staff_id:req.body.staff_id};
  const sql = `INSERT INTO work_request SET ?`;
  connection.query(sql,data, (err,result)=> {
     if(err){
     throw err;
      }else{
        res.send({
          message:'Work request submitted'
        });
     }
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                            ///VIEW PROGRESS OF RERQUEST///
app.get('/staff/checkStatus',(req,res)=>{
  let ref_number=req.body.ref_number;///staff inputs the the reference number of request
  const sql=`SELECT id,progress FROM work_request WHERE id= "${ref_number}"`;
  connection.query(sql,(err,result)=>{
    if(err){
      throw err;
       }else{
         res.send(result);
      }
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**                                                      VIEW MY REQUESTS                                                                  */
app.get('/staff/loggedRequests/:staff_id',(req,res)=>{
    const sql=`SELECT id,description,category,req_date,venue,progress,status
            FROM work_request
            WHERE staff_id ="${req.params.staff_id}"
            ORDER BY req_date`
    connection.query(sql,(err,result)=>{
      if(err){
        throw err;
         }else{
           res.send(result);
        }
    })     
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                            ///STAFF SENDING FEEDBACK///
  app.post("/staff/sendFeedback/",(req,res)=>{
   let{staff_feedback,rating}=req.body;
   let id=req.body.id;
    const sql=`UPDATE work_request
            SET staff_feedback= ?
                ,rating =?
               WHERE id=?`;///reference
    connection.query(sql,[staff_feedback,rating,id],(err,result)=>{
      if(err){
        res.send({mesaage:'Could not process feedback'});
      }else{
        res.send({mesaage:'Feedback submitted',result});
        console.log(({mesaage:'Feedback submitted',result}))
      } 
    });
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                                       AUTHENTICATE STAFF NUMBER                                                                              */
app.post('/staff/authenticateStaffNumber',(req,res)=>{
  let staff_id=req.body.staff_id;///staff inputs their staff number
  const sql=`SELECT * FROM staff
             WHERE staff_id=${staff_id}`;
  connection.query(sql,(err,result)=>{
      if(result.length>0){
           res.send({
            message:`Aunthentication completed for ${result[0].staff_name} ${result[0].staff_surname}!`,
            success:true
               })
           }
          else{
          res.send({
            message:"Entered staff number not found!",
            success:false
          });
         }
  });
});
};