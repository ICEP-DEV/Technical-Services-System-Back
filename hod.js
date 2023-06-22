dbconnection= require('../config/connection');


module.exports=app=>{
 const connection=dbconnection();

   app.get('/hod/getDept-Requests/:hod_id',(req,res)=>{
        const sql=`SELECT w.id,
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
                 AND d.department_id = h.department_id
                 AND h.hod_id =${req.params.hod_id}`;
    connection.query(sql,(err,result)=>{
      if(err){
        res.send({message:`Process failed....`})
      }if(result.length>0){
        res.send(result)
      }
    });             

   });
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*||||||||||  track progress DB Script||||||||||*/

  dbconnection= require('../config/connection');


  module.exports=app=>{
   const connection=dbconnection();
  
     app.get('/hod/getDept-trackProgress/:hod_id',(req,res)=>{
          const sql=`SELECT h.hod_id,
                            h.name,
                            h.surname,
                            w.id,
                            s.staff_id,
                            s.staff_name,
                            s.staff_surname,
                            w.req_date,
                            w.category,
                            w.status,
                            w.progress
                   FROM work_request w,staff s,hod h
                   WHERE w.staff_id=s.staff_id
                   AND s.department_id = h.department_id
              AND h.hod_id =${req.params.hod_id}`;
      connection.query(sql,(err,result)=>{
        if(err){
          res.send({message:`Process failed....`})
        }if(result.length>0){
          res.send(result)
        }
      });             
  
     });
  };