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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                     /**VIEW ALL REQUESTS IN SYSTEM */
  app.get("/admin/requests", (req, res) => {
    sql=`SELECT id, description, DATE_FORMAT(req_date, '%Y/%M/%d') as req_date, category,priority,venue,progress,staff_feedback,tech_feedback,
    rating,status,completed_date,assigned_date,admin_id,tech_id,staff_id 
    FROM work_request 
    ORDER BY req_date DESC`;
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
                                            /*VIEWS ALL ACTIVE AND UNASSIGNED REQUESTS*/
  app.get('/admin/viewAll',(req,res)=>{
    const sql=`SELECT  id, description, DATE_FORMAT(req_date, '%Y/%M/%d') as req_date, category,priority,venue,progress,staff_feedback,tech_feedback,
              rating,status,completed_date,assigned_date,admin_id,tech_id,staff_id  
    FROM work_request 
    WHERE status='active' 
    AND tech_id IS NULL
    ORDER BY req_date DESC`;
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
  res.send({message:'Priority of task set!'}); 
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
/**                                             VIEW ALL TECHNICIANS IN THE SYSTEM                                                             */
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
  let admin_id=req.body.admin_id;
  let password=req.body.password;
  const sql=`SELECT * 
            FROM administrator 
            WHERE admin_id="${admin_id}"`;
  connection.query(sql,(err,result)=>{
    if(result.length>0){
      if(result[0].password == password){
         res.send({
            message:`Hello ${result[0].admin_name} ${result[0].admin_surname}, You've Successfully logged in!`,
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
        message:"Please enter correct ID!",
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
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**      
   *                                        EXPORT CLOSED LOGS                                                       */
  app.get('/admin/export-closed',(req,res)=>{  
    const sql=`SELECT w.id  AS Reference_Number,
              w.req_date AS Request_Date,
              w.category AS Category,
              s.campus AS Campus,
              d.department AS Department,
              CONCAT(SUBSTRING(s.staff_name,1,1),' ',s.staff_surname) AS Complainant ,
              w.status AS Status,
              CONCAT(SUBSTRING(t.name,1,1),' ',t.surname) AS Dispatched_Technician,
              DATEDIFF(w.completed_date, w.req_date) AS Duration
              FROM work_request w, staff s, department d,technician t
              WHERE s.staff_id =w.staff_id
              AND d.department_id=s.department_id
              AND w.status='closed'`
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
          res.setHeader("Content-Disposition","attachment; filename=Closed-requests.csv");
          res.status(200).end(csv_data);
         }
       });           
    });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**      
   *                                        EXPORT ACTIVE LOGS                                                       */
  app.get('/admin/export-active',(req,res)=>{  
    const sql=`SELECT w.id  AS Reference_Number,
              w.req_date AS Request_Date,
              w.category AS Category,
              s.campus AS Campus,
              d.department AS Department,
              CONCAT(SUBSTRING(s.staff_name,1,1),' ',s.staff_surname) AS Complainant ,
              w.status AS Status
              FROM work_request w, staff s, department d,technician t
              WHERE s.staff_id =w.staff_id
              AND d.department_id=s.department_id
              AND w.status='active'`
    connection.query(sql,(err,result)=>{
      if(err){
        res.send('Something went wrong...')
       }
      if(result.length>0){
          let mysql_data=JSON.parse(JSON.stringify(result));
          let file_header= ['Reference Number','Request Date','Category','Campus','Department','Complainant','Status'];
          let json_data=new data_exporter({file_header});
          var csv_data=json_data.parse(mysql_data);
          res.setHeader("Content-Type","text/csv");
          res.setHeader("Content-Disposition","attachment; filename=Active-requests.csv");
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
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**                                                     TECHNICAL SERVICES DATA ANALYSIS              */                                         
  app.get('/admin/ServiceStatistics',(req,res)=>{
    const sql_1 =`SELECT count(id) AS complete FROM work_request WHERE progress = 'complete'`;
    const sql_2=`SELECT count(id) AS total_tasks FROM work_request `;
    const sql_3=`SELECT count(id) AS closed FROM work_request  WHERE status='closed'`;
    const sql_4=`SELECT DATEDIFF(completed_date, req_date) AS Duration FROM work_request WHERE progress='complete'`;
    const sql_5=`SELECT count(id) AS in_progress FROM work_request WHERE progress = 'in-progress'`;
    const sql_6=`SELECT count(id) AS pending FROM work_request WHERE progress = 'pending'`;
    const sql_7=`SELECT count(id) AS unassigned FROM work_request WHERE tech_id IS NULL`;
    const sql_8=`SELECT count(id) AS active FROM work_request WHERE status = 'active'`;
    const sql_9=`SELECT count(DISTINCT w.id) AS active FROM work_request w,staff s WHERE w.status ='active' AND s.campus='Soshanguve South' AND s.staff_id=w.staff_id`;
    const sql_10=`SELECT count(DISTINCT w.id) AS complete FROM work_request w,staff s WHERE w.progress ='complete' AND s.campus='Soshanguve South' AND s.staff_id=w.staff_id`;
    const sql_11=`SELECT count(DISTINCT w.id) AS closed FROM work_request w,staff s WHERE w.status ='closed' AND s.campus='Soshanguve South' AND s.staff_id=w.staff_id`;
    const sql_12=`SELECT count(DISTINCT w.id) AS total_tasks FROM work_request w,staff s WHERE s.campus='Soshanguve South' AND s.staff_id=w.staff_id`;
    const sql_13=`SELECT count(DISTINCT w.id) AS active FROM work_request w,staff s WHERE w.status = 'active' AND s.campus='eMalahleni' AND s.staff_id=w.staff_id`;
    const sql_14=`SELECT count(DISTINCT w.id) AS complete FROM work_request w,staff s WHERE w.progress ='complete' AND s.campus='eMalahleni' AND s.staff_id=w.staff_id`;
    const sql_15=`SELECT count(DISTINCT w.id) AS closed FROM work_request w,staff s WHERE w.status ='closed' AND s.campus='eMalahleni' AND s.staff_id=w.staff_id`;
    const sql_16=`SELECT count(DISTINCT w.id) AS total_tasks FROM work_request w,staff s WHERE s.campus='eMalahleni' AND s.staff_id=w.staff_id`;
    const sql_17=`SELECT count(DISTINCT w.id) AS active FROM work_request w,staff s WHERE w.status = 'active' AND s.campus='Pretoria' AND s.staff_id=w.staff_id`;
    const sql_18=`SELECT count(DISTINCT w.id) AS complete FROM work_request w,staff s WHERE w.progress ='complete' AND s.campus='Pretoria' AND s.staff_id=w.staff_id`;
    const sql_19=`SELECT count(DISTINCT w.id) AS closed FROM work_request w,staff s WHERE w.status ='closed' AND s.campus='Pretoria' AND s.staff_id=w.staff_id`;
    const sql_20=`SELECT count(DISTINCT w.id) AS total_tasks FROM work_request w,staff s WHERE s.campus='Pretoria' AND s.staff_id=w.staff_id`;
    const sql_21=`SELECT count(DISTINCT w.id) AS active FROM work_request w,staff s WHERE w.status = 'active' AND s.campus='Ga-rankuwa' AND s.staff_id=w.staff_id`;
    const sql_22=`SELECT count(DISTINCT w.id) AS complete FROM work_request w,staff s WHERE w.progress ='complete' AND s.campus='Ga-rankuwa' AND s.staff_id=w.staff_id`;
    const sql_23=`SELECT count(DISTINCT w.id) AS closed FROM work_request w,staff s WHERE w.status ='closed' AND s.campus='Ga-rankuwa' AND s.staff_id=w.staff_id`;
    const sql_24=`SELECT count(DISTINCT w.id) AS total_tasks FROM work_request w,staff s WHERE s.campus='Ga-rankuwa' AND s.staff_id=w.staff_id`;
    const sql_25=`SELECT count(DISTINCT w.id) AS active FROM work_request w,staff s WHERE w.status = 'active' AND s.campus='Arcadia' AND s.staff_id=w.staff_id`;
    const sql_26=`SELECT count(DISTINCT w.id) AS complete FROM work_request w,staff s WHERE w.progress ='complete' AND s.campus='Arcadia' AND s.staff_id=w.staff_id`;
    const sql_27=`SELECT count(DISTINCT w.id) AS closed FROM work_request w,staff s WHERE w.status ='closed' AND s.campus='Arcadia' AND s.staff_id=w.staff_id`;
    const sql_28=`SELECT count(DISTINCT w.id) AS total_tasks FROM work_request w,staff s WHERE s.campus='Arcadia' AND s.staff_id=w.staff_id`;
    const sql_29=`SELECT count(DISTINCT w.id) AS active FROM work_request w,staff s WHERE w.status = 'active' AND s.campus='Polokwane' AND s.staff_id=w.staff_id` ;
    const sql_30=`SELECT count(DISTINCT w.id) AS complete FROM work_request w,staff s WHERE w.progress ='complete' AND s.campus='Polokwane' AND s.staff_id=w.staff_id`;
    const sql_31=`SELECT count(DISTINCT w.id) AS closed FROM work_request w,staff s WHERE w.status ='closed' AND s.campus='Polokwane' AND s.staff_id=w.staff_id`;
    const sql_32=`SELECT count(DISTINCT w.id) AS total_tasks FROM work_request w,staff s WHERE s.campus='Polokwane' AND s.staff_id=w.staff_id`;
    const sql_33=`SELECT count(DISTINCT w.id) AS active FROM work_request w,staff s WHERE w.status = 'active' AND s.campus='Soshanguve North' AND s.staff_id=w.staff_id`;
    const sql_34=`SELECT count(DISTINCT w.id) AS complete FROM work_request w,staff s WHERE w.progress ='complete' AND s.campus='Soshanguve North' AND s.staff_id=w.staff_id`;
    const sql_35=`SELECT count(DISTINCT w.id) AS closed FROM work_request w,staff s WHERE w.status ='closed' AND s.campus='Soshanguve North' AND s.staff_id=w.staff_id`;
    const sql_36=`SELECT count(DISTINCT w.id) AS total_tasks FROM work_request w,staff s WHERE s.campus='Soshanguve North' AND s.staff_id=w.staff_id`;
    const sql_37=`SELECT count(DISTINCT w.id) AS active FROM work_request w,staff s WHERE w.status = 'active' AND s.campus='Arts' AND s.staff_id=w.staff_id`;
    const sql_38=`SELECT count(DISTINCT w.id) AS complete FROM work_request w,staff s WHERE w.progress ='complete' AND s.campus='Arts' AND s.staff_id=w.staff_id`;
    const sql_39=`SELECT count(DISTINCT w.id) AS closed FROM work_request w,staff s WHERE w.status ='closed' AND s.campus='Arts' AND s.staff_id=w.staff_id`;
    const sql_40=`SELECT count(DISTINCT w.id) AS total_tasks FROM work_request w,staff s WHERE s.campus='Arts' AND s.staff_id=w.staff_id`
    connection.query(sql_2,(err1,result1)=>{
    connection.query(sql_1,(err2,result2)=>{
        connection.query(sql_3,(err3,result3)=>{
        connection.query(sql_4,(err4,result4)=>{
        connection.query(sql_5,(err5,result5)=>{
              connection.query(sql_6,(err6,result6)=>{
                connection.query(sql_7,(err7,result7)=>{
                  connection.query(sql_8,(err8,result8)=>{
                    connection.query(sql_9,(err9,result9)=>{
                      connection.query(sql_10,(err10,result10)=>{
                        connection.query(sql_11,(err11,result11)=>{
                          connection.query(sql_12,(err12,result12)=>{//total
                            connection.query(sql_13,(err13,result13)=>{
                              connection.query(sql_14,(err14,result14)=>{
                                connection.query(sql_15,(err15,result15)=>{
                                  connection.query(sql_16,(err16,result16)=>{
                                    connection.query(sql_17,(err17,result17)=>{
                                    connection.query(sql_18,(err18,result18)=>{ 
                                    connection.query(sql_19,(err19,result19)=>{ 
                                    connection.query(sql_20,(err20,result20)=>{ 
                                    connection.query(sql_21,(err21,result21)=>{ 
                                    connection.query(sql_22,(err22,result22)=>{ 
                                    connection.query(sql_23,(err23,result23)=>{  
                                    connection.query(sql_24,(err24,result24)=>{  
                                    connection.query(sql_25,(err25,result25)=>{ 
                                    connection.query(sql_26,(err26,result26)=>{ 
                                    connection.query(sql_27,(err27,result27)=>{ 
                                    connection.query(sql_28,(err28,result28)=>{ 
                                    connection.query(sql_29,(err29,result29)=>{ 
                                    connection.query(sql_30,(err30,result30)=>{  
                                    connection.query(sql_31,(err31,result31)=>{  
                                    connection.query(sql_32,(err32,result32)=>{ 
                                    connection.query(sql_33,(err33,result33)=>{  
                                    connection.query(sql_34,(err34,result34)=>{ 
                                    connection.query(sql_35,(err35,result35)=>{  
                                    connection.query(sql_36,(err36,result36)=>{    
                                    connection.query(sql_37,(err37,result37)=>{ 
                                    connection.query(sql_38,(err38,result38)=>{  
                                    connection.query(sql_39,(err39,result39)=>{   
                                    connection.query(sql_40,(err40,result40)=>{         
                                    if(err1 && err2 && err3 && err4){
                                      res.send({message:`Something went wrong with the server...`,success:false});
                                     }
                                    let rate;
                                    let days=0;
                                    if(result1.length>0 && result2.length>0 && result3.length>0 ){
                                    averageComplete=Math.round((result2[0].complete/result1[0].total_tasks)*100);
                                     averageClosed=Math.round((result3[0].closed/result1[0].total_tasks)*100);
                                    averageInprogress=Math.round((result5[0].in_progress/result1[0].total_tasks)*100);
                                    averagePending=Math.round((result6[0].pending/result1[0].total_tasks)*100);
                                    averageComplete_soshSouth=Math.round((result10[0].complete/result12[0].total_tasks)*100);
                                    averageComplete_soshNorth=Math.round((result34[0].complete/result36[0].total_tasks)*100);
                                    averageComplete_Pretoria=Math.round((result18[0].complete/result20[0].total_tasks)*100);
                                    averageComplete_Emalahleni=Math.round((result14[0].complete/result16[0].total_tasks)*100);
                                    averageComplete_Garankuwa=Math.round((result22[0].complete/result24[0].total_tasks)*100);
                                    averageComplete_Arcadia=Math.round((result26[0].complete/result28[0].total_tasks)*100);
                                    averageComplete_Arts=Math.round((result38[0].complete/result40[0].total_tasks)*100);
                                    averageComplete_Polokwane=Math.round((result32[0].complete/result30[0].total_tasks)*100);
                                    for(let i=0;i<result4.length;i++){
                                    days+=result4[i].Duration;
                                    }
                                    rate=Math.round(days/result4.length);

                                    res.send({averageCompleted:averageComplete,/////average percentage of closed logs
                                    averageClosed:averageClosed,///The average percentage of closed logs
                                    LogResolutionRate:rate,//// LogResolutionRate the avverage number of days it takes to resolve a log
                                    averageInProgress:averageInprogress,///The average percentage of inProgress logs
                                    averagePending:averagePending,///////The average percentage of pending logs
                                    averageComplete_soshSouth:averageComplete_soshSouth,
                                    averageComplete_soshNorth: averageComplete_soshNorth,
                                    averageComplete_Pretoria:averageComplete_Pretoria,
                                    averageComplete_Emalahleni:averageComplete_Emalahleni,
                                    averageComplete_Garankuwa:averageComplete_Garankuwa,
                                    averageComplete_Arcadia:averageComplete_Arcadia,
                                    averageComplete_Arts:averageComplete_Arts,
                                    averageComplete_Polokwane:averageComplete_Polokwane,
                                    totalUnassigned:result7[0].unassigned,////Total number of tasks with no assigned artisan
                                    totalActive:result8[0].active,
                                    SoshanguveSouthActive:result9[0].active,
                                    SoshanguveNorthActive:result33[0].active,
                                    eMalahleniActive:result13[0].active,
                                    PretoriaActive:result17[0].active,
                                    GarankuwaActive:result21[0].active,
                                    ArcadiaActive:result25[0].active,
                                    ArtsActive:result37[0].active,
                                    PolokwaneActive:result29[0].active,  
                                    SoshanguveSouthComplete:result10[0].complete,
                                    SoshanguveNorthComplete:result34[0].complete,
                                    eMalahleniComplete:result14[0].complete,
                                    PretoriaComplete:result18[0].complete,
                                    GarankuwaComplete:result22[0].complete,
                                    ArcadiaComplete:result26[0].complete,
                                    PolokwaneComplete:result30[0].complete,
                                    ArtsComplete:result38[0].complete,
                                    SoshanguveSouthClosed:result11[0].closed,
                                    SoshanguveNorththClosed:result35[0].closed,
                                    GarankuwaComplete:result23[0].closed,
                                    eMalahleniClosed:result15[0].closed,
                                    PretoriaClosed:result19[0].closed,
                                    ArcadiaClosed:result27[0].closed,
                                    PolokwaneClosed:result31[0].closed,
                                    ArtsClosed:result39[0].closed,
                                    Pending:result6[0].pending
                                  });
                                }
                              }); 
                            });
                          });
                        })
                                    });
                                  });
                                });
                                  });
                                });
                                  });
                                   });
                                    });
                                     });
                                    });
                                    });
                                    }); 
                                    });
                                    });
                                    });
                                    });
                                  });
                                  });  
                                  });
                                  });
                                 });
                                });
                              })
                            });   
                          });
                        });
                      });
                    });   
                 });
                });  
              });
            });
          });
        });
       }); 
    });
  })
  
};