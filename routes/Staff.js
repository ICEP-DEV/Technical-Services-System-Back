const express = require('express');
const router = express.Router();
const dbConnection = require('../config/connection');

module.exports = router => {

  const connection = dbConnection();
}



//get all data

router.get('/staff',(req,res)=>{

    let qr ='select * from staff';

    db.query(qr,(err,result)=>{

        if(err)
        {
            console.log(err,'errs');
        }
        if(result.length>0)
        {
            res.send({
                message:'all user data',
                data:result
            });
        }

    });
});


// get single data

router.get('/staff/:id',(req,res)=>{

        let gID = req.params.id;

        let qr = `select * from staff where id = ${gID}`;

        db.query(qr,(err,result)=>{
            
            if(err) {console.log(err);}
            
            if(result.length>0)
            {
                    res.send({
                        message:'get single data',
                        data:result
                });
            }
            else
            {
                    res.send({
                        message:'data not found'
                    });
            }
        });
});

// create data

router.post('/staff',(req,res)=>{

  console.log(req.body,'createdata');

  let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  let office = req.body.office;
  let job_title = req.body.job_title;
  let gender = req.body.gender;
  let deptid = req.body.deptid;

  let qr = `insert into staff(staff_name,email,phone,office,job_title,gender,department_id)
              values('${name}','${email}','${phone}','${office}','${job_title}','${gender}','${deptid}')`;
  console.log(qr,'qr')
      db.query(qr,(err,result)=>{

              if(err){console.log(err);}
              console.log(result,'result')
              res.send({
                  message:'data inserted',
              });
      });
});


// update single data

router.put('/staff/:id',(req,res)=>{
  
  console.log(req.body,'updatedata');

    let gID = req.params.id;
    let name = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  let office = req.body.office;
  let job_title = req.body.job_title;
  let gender = req.body.gender;
  let deptid = req.body.deptid;
  

  let qr = `update staff set staff_name = '${name}', email = '${email}', phone = '${phone}', office = '${office}', job_title = '${job_title}',gender = '${gender}',department_id = '${deptid}';
  where id = ${gID}`;

  db.query(qr,(err,result)=>{

          if(err) {console.log(err);}

          res.send({
              message:'data updated'
          });
  });        
})


// delete single data

router.delete('/staff/:id',(req,res)=>{

    let qID = req.params.id;

    let qr = `delete from staff where id = '${qID}'`;
    db.query(qr,(err,result)=>{
        if(err) {console.log(err);}

        res.send(
            {
                message:'data deleted'
            }
        )
    });
});

module.exports = router