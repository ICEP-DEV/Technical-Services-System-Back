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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                            ///STAFF SENDING FEEDBACK///
  app.post("/staff/sendFeedback/:id",(req,res)=>{
   let{staff_feedback,rating}=req.body;
   let id=req.params.id;
    const sql=`UPDATE work_request
            SET staff_feedback= ?
                ,rating =?
               WHERE id=?`;
    connection.query(sql,[staff_feedback,rating,id],(err,result)=>{
      if(err){
        res.send({mesaage:'Could not process feedback'});
      }else{
        res.send({mesaage:'Feedback submitted'});
      } 
    });
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                                       AUTHENTICATE STAFF NUMBER                                                                              */
app.post('/staff/authenticateStaffNumber',(req,res)=>{
  let staff_num=req.body.staff_num;///staff inputs their staff number
  const sql=`SELECT staff_id FROM staff`;
  connection.query(sql,(err,result)=>{
    if(result.length>0){
      if(result[0].staff_id ==staff_num ){
         res.send({
            message:'Aunthentication completed!'
          })
      }
      else{
        res.send({
          message:"Entered staff number not found!"
        });
      }

    }
  });
});
};