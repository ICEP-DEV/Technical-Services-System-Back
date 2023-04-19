const dbConnection = require('../config/connection');


module.exports = app => {
  const connection = dbConnection();
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**                                     TECHNICIAN VIEWS TASKS ASSIGNED THEM                                                    */  
  app.get('technician/tasks',(req,res)=>{
    const sql="SELECT w.description, w.priority, w.venue, w.category FROM work_request w,technician t WHERE w.tech_id = t.id;"
    connection.query(sql,(err,result)=>{
      if(err){
        throw err;
      }
      res.send(result);
    })
   })

   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**                                     TECHNICIAN UPDATE THEIR PROGRESS OF TASK                                                 */
  app.post('technician/updateTask:tech_id',(req,res)=>{
    let status=req.body.status;
    const sql="UPDATE work_order SET status=? WHERE tech_id=? ";
    connection.query(sql,status,(err,result)=>{
      if(err){
          throw err;
      }
      res.send({message:"Progress Status updated!"});
    })
  })
     /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**                                     TECHNICIAN LOG-IN AUTHENTICATION                                                */
   app.post('/technician/adminLogin',(req,res)=>{
      let technician_email=req.body.technician_email;
      let password=req.body.password;
      const sql=`SELECT * FROM technician WHERE email="${admin_email}"`;
      connection.query(sql,(err,result)=>{
        if(result.length>0){
          if(result[0].password == password){
             res.send({
                message:'Successfully Logged In!'
              });
          }
          else{
            res.send({
              message:"Incorrect Details!"
            });
          }
    
        }
        else{
          throw err;
        }
      });
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /*                                        TECHNICIAN VIEWS GIVEN STAFF FEEDBACK                                                                 */
    app.get('technician/ViewFeedback:tech_id',(req,res)=>{
      const sql=`SELECT s.name,s.surname,w.staff_feedback,w.rating, FROM work_request w,staff s WHERE s.staff_id =w.staff_id AND tech_id= ?`;
      connection.query(sql,(err,result)=>{
        if(err){
          throw err;
      }
      res.send(result);
      });
    });
     ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   /*                                        TECH GIVES FEEDBACK REGARDING TASK                                                               */
  app.post('admin/feedback:id',(req,res)=>{
    let tech_feedback=body.req.tech_feedback;
    const sql=`UPDATE work_request
            SET tech_feedback= ?
            WHERE id=?`;
    connection.query(sql,tech_feedback,(err,result)=>{
      if(err){
       res.send({message:"An error occured!"}) ;
     }
       res.send({message:"Feedback submitted"});
    })        
  })
}