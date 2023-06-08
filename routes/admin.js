const { result } = require('@hapi/joi/lib/base');
const { body } = require('express-validator');
const { json } = require('express/lib/response');
const dbConnection = require('../config/connection');
const data_exporter= require('json2csv').Parser;

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
  app.get("/admin/viewAllrequest/:staff_id", (req, res) => {
    sql=`SELECT w.id, w.description,w.category,w.req_date, s.staff_name,s.campus,w.image,w.progress 
         FROM work_request w,staff s 
         WHERE s.staff_id=w.staff_id
         AND w.status='active'
         AND w.staff_id=${req.params.staff_id}`;
    connection.query(sql, (err, result) => {
      if(err)
      {
         res.send({message:`An error occured`});
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
    sql=`SELECT DISTINCT s.staff_name,s.staff_surname,s.email,d.faculty,d.department,s.campus,s.staff_id
    FROM work_request w,staff s,department d 
    WHERE s.staff_id=w.staff_id
    AND s.department_id=d.department_id`;
    connection.query(sql,(err,result)=>{
      if(err){
        res.send({message:`An error ocurred`});
      }else{
        res.send({
          result
      });
      }
    })
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  app.get('/admin/viewAll',(req,res)=>{
    const sql=`SELECT * FROM work_request WHERE status='active' ORDER BY req_date DESC`;
    connection.query(sql,(err,result)=>{
      if(err){
        res.send({message:`An error ocurred`});
      }else{
        res.send({
          result
      });
      }
    });
  });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        ////THE ADIM SETS THE PRIORITY OF THE REQUEST

app.put("/admin/setPriority/:id",(req,res)=>{
  let priority=req.body.priority;
  const sql=`UPDATE work_request SET priority=?, progress='acknowlegded' WHERE id='${req.params.id}'`;
  connection.query(sql,priority,(err,result)=>{
    if(err){
      res.send({message:`An error occured`});
  }
  else{
  res.send({message:'Priority of task set'}); 
  }
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
    if(result.length>0){
    res.send(result);
    }
    })
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                                       VIEW AVAILABLE TECHNICIANS*/
app.get('/admin/availableTechnician/:id',(req,res)=>{
  const sql=`SELECT t.tech_id,t.name,t.surname,t.phone,t.email
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
  else{
  res.send(result);
  }
  })
})            

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                     /*ASSIGN A TECHNICIAN*/
app.post('/admin/assignTechnician/:id',(req,res)=>{
  let tech_id=req.body.tech_id;
  let admin_id=req.body.admin_id;
  const sql=`UPDATE work_request 
            SET progress='in-progress',
                tech_id='${tech_id}',
                 assigned_date='${ new Date().toJSON().slice(0, 10)}',
                 admin_id='${admin_id}'
            WHERE id='${req.params.id}'`
  connection.query(sql,(err,result)=>{
    if(err){
      res.send({message:"An error occured",
        success:false});
  }
  else{
    res.send({message:'Technician assigned to task',success:true}); 
   }
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
      res.send({message:`An error occcured`,success:false});
    }
    if(result.length>0){
    res.send({result,success:true});
    }
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
      res.send({message:`An errorr occured`})
    }
    if(result.length>0){
    res.send(result);
    }
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
   res.send({message:`An error occured`,success:false});
  }
  if(result.length>0){
  res.send(result);
  }
 })
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                                VIEW COMPLETED TASKS                                                                           */
app.get('/admin/viewCompletedTasks',(req,res)=>{
  const sql=`SELECT l.id,
                    l.description,
                    t.name,t.surname,
                    l.progress,
                    s.staff_name,s.staff_surname,
                    DATEDIFF(l.completed_date, l.req_date) AS Duration
            FROM technician t,work_request l,staff s 
            WHERE l.tech_id=t.tech_id AND l.staff_id=s.staff_id AND l.progress='complete' `;
  connection.query(sql,(err,result)=>{
   if(err){
     res.send({message:`Process failed...`});
   }if(result.length>0){
   res.send(result);
  }
  });
 });


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                         /* NUmber completed*/
 app.get('/admin/viewTotalComplete',(req,res)=>{
  const sql=`SELECT count(id) AS total_completed
            FROM technician t,work_request l,staff s 
            WHERE l.tech_id=t.tech_id AND l.staff_id=s.staff_id AND l.progress='complete' `;
  connection.query(sql,(err,result)=>{
   if(err){
     res.send({message:`Process failed...`});
   }if(result.length>0){
   res.send(result);
  }
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
    if(result.length>0){
    res.send({message:'Technician Added'});
    }
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                    /*VIEW TOTAL NUMBER OF TECHNICIANS*/
app.get('/admin/viewNumTechnicians',(req,res)=>{
  const sql= `SELECT COUNT(tech_id) AS total_tech
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
        res.send({message:"An error occured"});
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
            message:`Hello ${result[0].name} ${result[0].surname}You've Successfully logged in!`,
            admin_id,
            success:true
          });
          console.log(result);
      }
      else{
        res.send({
          message:"Please enter correct password!",
          success:false
        });
        
      }
    }else
    {
      res.send({
        message:"Please enter correct email!",
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
        res.send({message:`An error ocurred...process failed`});
      }
      else{
        res.send({message:`"${req.params.id}" deleted`});
      }
    });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**                                           CLOSE LOG                                                 */
app.put('/admin/log-close/:id',(req,res)=>{
  const sql=`UPDATE work_request 
            SET status='closed'
            WHERE id='${req.params.id}'`;
  connection.query(sql,(err,result)=>{
    if(err){
      res.send({message:`An error occured!`,
                success:true});
    }else{
      res.send({message:`Log ${req.params.id} closed!`,
                  success:true});
    }
  });         
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**                                       RE-ACTIVATE log                                                                */
app.put('/admin/log-activate/:id',(req,res)=>{
    const sql=`UPDATE work_request
              SET status='active'
              WHERE id = '${req.params.id}'`;
    connection.query(sql,(err,result)=>{
      if(err){
        res.send({message:`An error occured!`,
                  success:true});
      }else{
        res.send({message:`Log ${req.params.id} has been re-activated!`,
                    success:true});
      }
    });          
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                               *SEARCH BY CAMPUS*/
app.get('/admin/getCampusRequests',(req,res)=>{
  let campus=req.body.campus;
  const sql=`SELECT * 
            FROM work_request w, staff s
            WHERE s.staff_id=w.staff_id
            AND campus=${campus}`
  connection.query(sql,(err,result)=>{
    if(err){
      res.send({message:"An error occured!"})
    }else
    {
      res.send(result);
    }
  });          
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                  /*VIEW ALL CLOSED LOGS */
app.get('/admin/getClosedLogs',(req,res)=>{
  const sql=`SELECT * 
             FROM work_request
             WHERE status='Closed'`;
  connection.query(sql,(err,result)=>{
    if(err){
      res.send({message:"An error occured!"})
    }else
    {
      res.send(result);
    }
  })           
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                               /**GET TOTAL NUMBER OF CLOSED REQUESTS*/
app.get('/admin/getTotalClossedLogs',(req,res)=>{
  const sql=`SELECT COUNT(id) AS Total_Closed
            FROM work_request 
            WHERE status='closed'`;
  connection.query(sql,(err,result)=>{
    if(err){
      res.send({message:"An error occured!"})
    }else
    {
      res.send(result);
    }
  })          
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                          /*EXPORT ALL REQUEST TO EXCEL*/
  app.get('/admin/export',(req,res)=>{
    const sql=`SELECT w.id  AS Reference_Number,
                      w.req_date AS Request_Date,
                      w.category AS Category,
                      s.campus AS Campus,
                      d.department AS Department,
                      CONCAT(SUBSTRING(s.staff_name,1,1),' ',s.staff_surname) AS Complainant ,
                      w.status AS Status
               FROM work_request w, staff s, department d
               WHERE s.staff_id =w.staff_id
               AND d.department_id=s.department_id`;
    connection.query(sql,(err,result)=>{
      if(err){
          res.send('Something went wrong...')
      }
      if(result.length>0){
        let mysql_data=JSON.parse(JSON.stringify(result));
        let file_header= ['Reference Number','Request Date','Category','Campus'];
        let json_data=new data_exporter({file_header});
        var csv_data=json_data.parse(mysql_data);
        res.setHeader("Content-Type","text/csv");
        res.setHeader("Content-Disposition","attachment; filename=requests.csv");
        res.status(200).end(csv_data);
    }
    });           
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*                                                     FILTER BY DATES                                                                       */
  app.get('/admin/searchByDates',(req,res)=>{
    date_1=req.body.date_1;
    date_2=req.body.date_2;
    
    const sql =`SELECT  description,category
                FROM work_request
                WHERE req_date BETWEEN '${date_1}'AND '${date_2}'`;
    connection.query(sql,(err,result)=>{
      if(err){
        res.send({message:`Something went wrong...`,success:false});
      }else{
        res.send({result,success:true})
      }
    });            
  });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                                      FILTER BY DEPT*/
  app.get('/admin/searchByDepartment',(req,res)=>{
    department=req.body.department;
    const sql=`SELECT w.id,
                          s.staff_name,
                          s.staff_surname,
                          w.req_date,
                          w.category,
                          w.status,
                          w.progress
                 FROM work_request w,staff s,department d
                 WHERE w.staff_id=s.staff_id
                 AND s.department_id = d.department_id
                 AND d.department='${department}'`;
    connection.query(sql,(err,result)=>{
       if(err){
         res.send({message:`Something went wrong...`,success:false});
        }else{
            res.send({result,success:true})
        }
    });              
  })
};