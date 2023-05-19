const { body } = require('express-validator');
const dbConnection = require('../config/connection');


module.exports = app => {
  const connection = dbConnection();
 // app.use(expressValidator());
  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);/**message error whenever connection fails */
    }
  
    console.log('Connected to MySQL server.');
  });
 
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                        ///VIEW ALL REQUESTS
  app.get("/admin/viewAllrequest", (req, res) => {
    sql=`SELECT w.id, w.description,w.category,w.req_date, s.staff_name,s.campus,w.image,w.progress 
         FROM work_request w,staff s 
         WHERE s.staff_id=w.staff_id`;
    connection.query(sql, (err, result) => {
      if(err)
      {
          console.log(err,'errs');
      }
      if(result.length>0)
      {
          res.send({
              result
          });
      }
    });
  });
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                              /*DISPLAYS THOSE THAT THAVE HAVE LOGGED A REQUEST*/
  app.get("/admin/viewRequester",(req,res)=>{
    sql=`SELECT w.id,s.staff_name,s.staff_surname,s.email,d.faculty,d.department,s.campus
        FROM work_request w,staff s,department d
        WHERE s.staff_id=w.staff_id
        AND s.department_id=d.department_id`;
    connection.query(sql,(err,result)=>{
      if(err){
        throw err;
      }else{
        res.send({
          result
      });
      }
    })
  });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        ////THE ADIM SETS THE PRIORITY OF THE REQUEST

app.post("/admin/setPriority/:id",(req,res)=>{
  let priority=req.body.priority;
  const sql=`UPDATE work_request SET priority=? WHERE id='${req.params.id}'`;
  connection.query(sql,priority,(err,result)=>{
    if(err){
      console.log(err.message);
      throw err;
  }
  res.send({message:'Priority of task set'}); 
  })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                          ////VIEWING A SPECIFIC REQUEST
app.get("/admin/viewRequest/:id",(req,res)=>{
    const sql=`SELECT id,req_date,category,venue,progress,status 
                FROM work_request   
                WHERE id=${req.params.id}`;
    connection.query(sql,(err,result)=>{
      if(err){
        res.send({message:"could not fetch data",
        success:true});
    }
    res.send(result);
    })
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                                       VIEW AVAILABLE TECHNICIANS*/
app.get('/admin/availableTechnician/:id',(req,res)=>{
  const sql=`SELECT t.tech_id,t.name,t.surname 
             FROM technician t,division d,work_request w 
             WHERE availability='available'
             AND d.id=t.division_id
             AND w.category = d.division_name
             AND w.id= ${req.params.id}`;
  connection.query(sql,(err,result)=>{
    if(err){
      res.send({message:"could not fetch data",
        success:false});
  }
  res.send(result);
  })
})            

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                     /*ASSIGN A TECHNICIAN*/
app.post('/admin/assignTechnician/:id',(req,res)=>{
  let tech_id=req.body.tech_id;
  let assigned_date=new Date().toISOString().slice(0, 10)
  const sql=`UPDATE work_request 
            SET status="active",
            progress="In-progress",
            tech_id=?,
            assigned_date=?
            WHERE id=${req.params.id}`
  connection.query(sql,tech_id,assigned_date,(err,result)=>{
    if(err){
      res.send({message:"An error occured",
        success:false});
  }
    res.send({message:'Technician assigned to task'}); 
  });
});
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**                                          VIEW TECHNICIAN PROGRESS                                                      */
 app.get('/admin/viewProgress/:id',(req,res)=>{
  
  const sql =`SELECT a.id,a.progress 
              FROM work_request a, technician t 
              WHERE a.tech_id = t.tech_id
              AND a.id=${req.params.id}`;
  connection.query(sql,(err,result)=>{
    if(err){
      throw err;
    }
    res.send(result);
  });
 }); 
   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 /**                                          VIEW FEEDBACK fFROM BOTH STAFF AND TECHNICIAN                                                    */
 app.get('/admin/viewFeedback',(req,res)=> {
  const sql=`SELECT s.staff_name,s.staff_surname,w.staff_feedback,w.tech_feedback,w.rating,t.name,t.surname
             FROM staff s,work_request w,technician t
             WHERE s.staff_id=w.staff_id AND t.tech_id=w.tech_id`;
  connection.query(sql,(err,result)=>{
    if(err){
      throw err;
    }
    res.send(result);
  });           
 });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                                  VIEW IN-PROGRESS TASKS                                                                    */
app.get('/admin/viewInProgressTasks',(req,res)=>{
 const sql=`SELECT l.id,l.description,t.name,l.progress,s.staff_name 
            FROM technician t,work_request l,staff s 
            WHERE l.tech_id=t.tech_id AND l.staff_id=s.staff_id AND l.progress='in-progress' `;
 connection.query(sql,(err,result)=>{
  if(err){
    throw err;
  }
  res.send(result);
 })
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                                VIEW COMPLETED TASKS                                                                           */
app.get('/admin/viewCompletedTasks',(req,res)=>{
  const sql=`SELECT l.id,l.description,t.name,l.progress,s.staff_name 
            FROM technician t,work_request l,staff s 
            WHERE l.tech_id=t.tech_id AND l.staff_id=s.staff_id AND l.progress='complete' `;
  connection.query(sql,(err,result)=>{
   if(err){
     throw err;
   }
   res.send(result);
  });
 });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**                                                 ADD  TECHNICIAN                                                                                */
app.post('/admin/addTechnician',(req,res)=>{
  let data={
    tech_id:req.body.tech_id,
    name:req.body.name,
    surname:req.body.surname,
    phone:req.body.phone,
    email:req.body.email,
    gender:req.body.gender,
    division_id:req.body.division_id,
    campus:req.body.campus
  };
  const sql = `INSERT INTO technician SET ?`;
  connection.query(sql,data,(err,result)=>{
    if(err){
      throw err;
    }
    res.send({message:'Technician Added'});
     });
  });  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**                                             VIEW ALL TECHNICIAN IN THE SYSTEM                                                             */
app.get('/admin/viewAllTechnicians',(req,res)=>{
  const sql= `SELECT t.tech_id,t.name,t.surname,t.phone,t.email,d.division_name  
              FROM technician t,division d
              WHERE t.division_id =d.id`;
  connection.query(sql,(err,result)=>{
    if(err)
    {
        throw err;
    }
    if(result.length>0)
    {
        res.send(result);
    }
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**                                            (1) RETRIEVE TOTAL NUMBER OF TASKS                                                           */
app.get('/admin/totalRequests',(req,res)=>{
  const sql=`SELECT COUNT(id) AS total_requests
            FROM work_request;`
  connection.query(sql,(err,result)=>{
    if(err)
    {
        throw err;
    }
    if(result.length>0)
    {
        res.send(result);
    }
  })
})
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 /*                                              LOGIN-AUTHENTICATION                                                                            */
app.post('/admin/login',(req,res)=>{
  let admin_email=req.body.admin_email;
  let admin_id=req.body.admin_id;
  let password=req.body.password;
  const sql=`SELECT * 
            FROM administrator 
            WHERE email="${admin_email}" OR admin_id="${admin_id}"`;
  connection.query(sql,(err,result)=>{
    if(result.length>0){
      if(result[0].password == password){
         res.send({
            message:'Successfully Logged In!',
            admin_id,
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                             DELETE A REQUEST                                                                                                   */
app.get('/admin/deleteRequest/:id',(req,res)=>{
    const sql=`DELETE FROM work_request
               WHERE id='${req.params.id}'`;
    connection.query(sql,(err,result)=>{
      if(err){
        throw err;
      }
      else{
        res.send({message:`"${req.params.id}" deleted`});
      }
    })
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**                                           CLOSE LOG                                                 */
app.post('/admin/log-close/:id',(req,res)=>{
  const sql=`UPDATE work_request 
            SET status='closed'
            WHERE id='${req.params.id}'`;
  connection.query(sql,(err,result)=>{
    if(err){
      throw err;
    }else{
      res.send({message:`log closed`})
    }
  })          
})
};



