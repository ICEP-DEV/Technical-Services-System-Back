const dbConnection = require('../config/connection');


module.exports = app => {
  const connection = dbConnection();
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**                                     TECHNICIAN VIEWS TASKS ASSIGNED THEM                                                    */  
  app.get('/technician/tasks/:tech_id',(req,res)=>{
    const sql=`SELECT w.id,w.category,w.description, w.priority,w.expected_date, w.venue,w.progress
              FROM work_request w,technician t 
              WHERE w.tech_id = t.tech_id AND w.tech_id='${req.params.tech_id}'`
    
    connection.query(sql,(err,result)=>{
      if(err){
        res.send({message:"An error occured",success:false});
      }
      res.send({result,success:true});
      
    })
  
   })

   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**                                     TECHNICIAN UPDATE THEIR PROGRESS OF TASK                                                 */
    global.arlet = '';        
  global.id='';
  global.ids='';
  app.put('/technician/updateTask/:id',(req,res)=>{
    let progress=req.body.progress;
    let sql;
    id=req.params.id;
    global.id=id;
    if(progress=='complete'){
      sql=`UPDATE work_request SET progress=?,completed_date='${ new Date().toJSON().slice(0, 10)}' 
      WHERE id='${id}' `
   
    }else{
      sql=`UPDATE work_request SET progress=? 
              WHERE id='${id}' `;
     }
    connection.query(sql,progress,(err,result)=>{
      if(err){
          res.send({message:"An error occured",success:false});
      }
      global.arlet =true;
      res.send({message:"Progress updated!",success:true});
    })
  })

   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**                                     set alert to staff and admin about task status to staff                                        */
    app.get('/technician/task/:staff_id',(req,res)=>{
      const sql=`SELECT id,staff_id,category,description, priority,expected_date, venue,progress,assigned_date
                FROM work_request 
                WHERE staff_id='${req.params.staff_id}' AND id='${global.id}'`
              
      connection.query(sql,async(err,result)=>{
        if(err){
          res.send({message:"An error occured",success:false});
        }

        if( global.arlet  ){
          console.log("id",global.id,result);
          res.send({result,arlet:global.arlet});
         
          global.arlet = ''; // Reset the global variable after using it
          
          global.id='';
        }else{
          await res.send({message:"no new tasks",success:false})
        }
      })
    
     })

     /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**                                     set alert to staff and admin about task status to admin                                      */
    app.get('/technician/task',(req,res)=>{
      const sql=`SELECT id,staff_id,category,description, priority,expected_date, venue,progress,assigned_date
                FROM work_request 
                WHERE  id='${global.ids}'`
              
      connection.query(sql,async(err,result)=>{
        if(err){
          res.send({message:"An error occured",success:false});
        }

        if( global.arlet  ){
          console.log("id",global.ids,result);
          res.send({result,arlet:global.arlet});
         
          global.arlet = ''; // Reset the global variable after using it
          
          global.ids='';
        }else{
          await res.send({message:"no new tasks",success:false})
        }
      })
    
     })


     /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**                                     TECHNICIAN LOG-IN AUTHENTICATION                                                */
   app.post('/technician/login',(req,res)=>{
    let tech_id=req.body.tech_id;
    let password=req.body.password;
    console.log(req.body)
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
          message:"Please enter correct ID!",
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
          res.send({message:"An error occurred",succes:false});
      }
      res.send({result,success:true});
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
       res.send({message:"An error occured!",success:false}) ;
     }
       res.send({message:"Feedback submitted",
       success:true
      });
    })        
  })
}