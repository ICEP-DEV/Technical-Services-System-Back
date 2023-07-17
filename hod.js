dbconnection= require('../config/connection');


module.exports=app=>{ 
 const connection=dbconnection();

   app.get('/hod/getDept-Requests/:hod_id',(req,res)=>{
         const sql=`SELECT
                          s.staff_name,
                          s.staff_surname,
                          w.req_date,
                          w.category,
                          w.description,
                          w.priority,
                          w.venue
                 FROM work_request w,staff s,department d,hod h
                 WHERE w.staff_id=s.staff_id
                 AND s.department_id = d.department_id
                 
                 AND h.hod_id =${req.params.hod_id}`;
    connection.query(sql,(err,result)=>{
      if(err){
        res.send({message:`Process failed....`})
      }if(result.length>0){
        res.send(result)
      }
    });             

   });

   app.put("/hod/sendFeedback/:id",(req,res)=>{
    let hod_feedback=req.body.hod_feedback;
     const sql=`UPDATE work_request
             SET hod_feedback=?
                WHERE id=?`;///reference-number
     connection.query(sql, [staff_feedback, req.params.id],(err,result)=>{
       if(err){
         res.send({mesaage:'Could not process feedback'});
       }else{
         res.send({mesaage:'Feedback submitted',result,success:true}); 
       } 
     });
   });
};
