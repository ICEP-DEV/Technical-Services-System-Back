const { body } = require('express-validator');
const dbConnection = require('../config/connection');


module.exports = app => {
  const connection = dbConnection();
  connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
  });
 
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                        ///VIEW ALL REQUESTS
  app.get("/admin/ViewAllrequest", (req, res) => {
    sql=`SELECT w.id, w.description,w.category,w.req_date, s.staff_name,s.campus,w.image 
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
              result:result
          });
      }
    });
  });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        ////THE ADIM SETS THE PRIORITY OF THE REQUEST

app.post("/admin/setPriority/:id",(req,res)=>{
  const sql="UPDATE work_request SET priority=? WHERE id=?";
  connection.query(sql,(err,result)=>{
    if(err){
      console.log(err.message);
      throw err;
  }
  res.send(201, req.body); 
  })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                          ////VIEWING A SPECIFIC REQUEST
app.get("/admin/viewRequest/:id",(req,res)=>{
    connection.query('SELECT * FROM work_request WHERE id = ?',req.body.id,(err,result)=>{
      if(err){
        console.log(err.message);
        throw err;
    }
    res.send(result);
    })
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                                       VIEW AVAILABLE TECHNICIANS*/
app.get('/admin/availableTechnician',(req,res)=>{
  const sql="SELECT name, surname FROM technician WHERE availability='available'";
  connection.query(sql,(err,result)=>{
    if(err){
      console.log(err.message);
      throw err;
  }
  res.send(result);
  })
})            

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                     /*ASSIGN A TECHNICIAN*/
app.post('/admin/assign:tech_id',(res,req)=>{
  const sql="UPDATE work_request SET tech_id=?";
  connection.query(sql,(err,result)=>{
    if(err){
      throw err;
    }
    res.send(result);
  })
  })
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**                                          VIEW TECHNICIAN PROGRESS                                                      */
 app.get('/admin/progresStatus',(req,res)=>{
  const sql ="SELECT a.id,a.progress FROM work_request a, technician t WHERE a.tech_id = t.tech_id;";
  connection.query(sql,(err,result)=>{
    if(err){
      throw err;
    }
    res.send(result);
  });
 }); 
   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 /**                                          VIEW FEEDBACK                                                    */
 app.get('/admin/viewFeedback',(req,res)=> {
  const sql=`SELECT s.name,s.surname,w.staff_feedback,w.tech_feedback,w.rating,t.name,t.surname
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
    id:req.body.id,
    name:req.body.name,
    surname:req.body.surname,
    phone:req.body.phone,
    email:req.body.email,
    gender:req.body.gender,
  };
  const sql = `INSERT INTO technician SET ?`;
  connection.query(sql,data,(err,result=>{
    if(err){
      throw err;
    }
    res.send({message:"Technician Added"});
  }));
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
  let password=req.body.password;
  const sql=`SELECT * FROM administrator WHERE email="${admin_email}"`;
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
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                             DELETE A REQUEST                                                                                                   */
app.get('/admin/deleteRequest:id',(req,res)=>{
    const sql=`DELETE * FROM work_request WHERE id=?`;
    connection.query(sql,(err,result)=>{
      if(err){
        throw err;
      }
      else{
        res.send({message:`${id} deleted`});
      }
    })
});
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////



