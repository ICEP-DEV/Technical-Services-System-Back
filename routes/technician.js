const dbConnection = require('../config/connection');


module.exports = app => {
  const connection = dbConnection();
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**                                     TECHNICIAN VIEWS TASKS ASSIGNED THEM                                                    */  
  app.get('/technician/tasks/:tech_id',(req,res)=>{
    const sql=`SELECT w.description, w.priority, w.venue, w.category 
              FROM work_request w,technician t 
              WHERE w.tech_id = t.tech_id AND w.tech_id='${req.params.tech_id}';`
    connection.query(sql,(err,result)=>{
      if(err){
        throw err;
      }
      res.send(result);
    })
   })

   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**                                     TECHNICIAN UPDATE THEIR PROGRESS OF TASK                                                 */
  app.post('/technician/updateTask/:id',(req,res)=>{
    let progress=req.body.progress;
    const sql=`UPDATE work_request SET progress=? 
              WHERE id='${req.params.id}' `;
    connection.query(sql,progress,(err,result)=>{
      if(err){
          throw err;
      }
      res.send({message:"Progress updated!"});
    })
  })
     /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**                                     TECHNICIAN LOG-IN AUTHENTICATION                                                */
   app.post('/technician/login',(req,res)=>{
    let tech_email=req.body.technician_email;
    let tech_id=req.body.tech_id;
    let password=req.body.password;
    const sql=`SELECT * 
              FROM technician 
              WHERE tech_id="${tech_id}"`;
    connection.query(sql,(err,result)=>{
      if(result.length>0){
        if(result[0].password == password){
           res.send({
              message:'Successfully Logged In!',
              result,
              success:true
            });
            console.log(result)
        }
        else{
          res.send({
            message:"Incorrect Details!",
            success:false
          });
          
        }
      }else
      {
        res.send({
          message:"Incorrect Details!",
          success:false
        });
      }
      });
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /*                                        TECHNICIAN VIEWS GIVEN STAFF FEEDBACK                                                                 */
    app.get('/technician/ViewFeedback/:tech_id',(req,res)=>{
      const sql=`SELECT s.name,s.surname,w.staff_feedback,w.rating
                 FROM work_request w,staff s 
                 WHERE s.staff_id =w.staff_id AND tech_id= ${req.body.tech_id}`;
      connection.query(sql,(err,result)=>{
        if(err){
          throw err;
      }
      res.send(result);
      });
    });
     ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   /*                                        TECH GIVES FEEDBACK REGARDING TASK                                                               */
  app.post('/technician/feedback/:id',(req,res)=>{
    let tech_feedback=req.body.tech_feedback;
    let id=req.params.id;
    const sql=`UPDATE work_request
            SET tech_feedback= ?
            WHERE id=${req.params.id}`;
    connection.query(sql,tech_feedback,(err,result)=>{
      if(err){
       res.send({message:"An error occured!"}) ;
     }
       res.send({message:"Feedback submitted"});
    })        
  })
}