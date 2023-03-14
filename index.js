// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql2/promise');

// const app = express();

// // Create a connection pool to the MySQL database
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'password',
//   database: 'mydatabase',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   port:3306
// });

// pool.getConnection((err, connection) => {
//   return new Promise((resolve, reject) => {
//       if (err) {
//           if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//               reject('Database connection was closed.');
//           }
//           if (err.code === 'ER_CON_COUNT_ERROR') {
//               reject('Database has too many connections.');
//           }
//           if (err.code === 'ECONNREFUSED') {
//               reject('Database connection was refused.');
//           }
//       }
//       if (connection) connection.release()
//       resolve();
//   });
// });


// // Parse requests of content-type 'application/json'
// app.use(bodyParser.json());

// // Handle GET requests to /animals
// app.get('/animals', async (req, res) => {
//   try {
//     const [rows, fields] = await pool.execute('SELECT * FROM animals');
//     res.send(rows);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('An error occurred');
//   }
// });

// // Handle POST requests to /animals
// app.post('/animals', async (req, res) => {
//   const { name, breed, gender, birthDate, breedingDate, value } = req.body;
//   try {
//     await pool.execute(
//       'INSERT INTO animals (name, breed, gender, birth_date, breeding_date,status, value) VALUES (?, ?, ?, ?, ?, ?)',
//       [name, breed, gender, birthDate, breedingDate, value]
//     );
//     res.send('Animal added successfully');
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('An error occurred');
//   }
// });

// // Retrieve all vaccination records
// app.get('/vaccinations', async (req, res) => {
//     try {
//       const [rows] = await pool.execute('SELECT * FROM vaccinations');
//       res.send(rows);
//     } catch (error) {
//       console.log(error);
//       res.status(500).send('An error occurred');
//     }
//   });
  
//   // Add a new vaccination record
//   app.post('/vaccinations', async (req, res) => {
//     const { animalId, name, date, notes } = req.body;
  
//     try {
//       await pool.execute(
//         'INSERT INTO vaccinations (animal_id, vacc_name, vacc_date, notes) VALUES (?, ?, ?, ?)',
//         [animalId, name, date, notes]
//       );
//       res.send('Vaccination record added successfully');
//     } catch (error) {
//       console.log(error);
//       res.status(500).send('An error occurred');
//     }
//   });
  
//   // Retrieve all vet records
//   app.get('/vets', async (req, res) => {
//     try {
//       const [rows] = await pool.execute('SELECT * FROM vets');
//       res.send(rows);
//     } catch (error) {
//       console.log(error);
//       res.status(500).send('An error occurred');
//     }
//   });
  
//   // Add a new vet record
//   app.post('/vets', async (req, res) => {
//     const { name, email, phone } = req.body;
  
//     try {
//       await pool.execute(
//         'INSERT INTO vets (name, email, phone) VALUES (?, ?, ?)',
//         [name, email, phone]
//       );
//       res.send('Vet added successfully');
//     } catch (error) {
//       console.log(error);
//       res.status(500).send('An error occurred');
//     }
//   });
  
//   // Retrieve all appointment records
//   app.get('/appointments', async (req, res) => {
//     try {
//       const [rows] = await pool.execute('SELECT * FROM appointments');
//       res.send(rows);
//     } catch (error) {
//       console.log(error);
//       res.status(500).send('An error occurred');
//     }
//   });
  
//   // Add a new appointment record
//   app.post('/appointments', async (req, res) => {
//     const { animalId, vetId, date, notes } = req.body;
  
//     try {
//       await pool.execute(
//         'INSERT INTO appointments (animal_id, vet_id, date, notes) VALUES (?, ?, ?, ?)',
//         [animalId, vetId, date, notes]
//       );
//       res.send('Appointment added successfully');
//     } catch (error) {
//       console.log(error);
//       res.status(500).send('An error occurred');
//     }
//   });
  

//   ////Search By Breed
// app.get('/breed',async (req,res)=>{
//    const {breed}=req.body;

//    try{
//       await pool.execute(
//         'SELECT * FROM animal WHERE breed=?',
//         [breed]
//       );
//       res.send('Breed retrieved!!!');
//     } catch (error) {
//       console.log(error);
//       res.status(500).send('An error occurred');
//    }
// });

// ////Retrieve Calves
// app.get('/animals', async (req, res) => {
//   try {
//     const [rows, fields] = await pool.execute('SELECT id,breed,DATEDIFF(currentdate(),birth_date) AS age FROM animals WHERE DATEDIFF(currentdate(),birth_date) < 12 ');
//     res.send(rows);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('An error occurred');
//   }
// });


// ////Retrieve those due for vaccinations
// app.get('/vaccination',async (req,res)=>{
//   try {
//     const [rows] = await pool.execute('SELECT * FROM vaccinations v,animals a WHERE DATEDIFF(currentdate(),vaccdate)>6 AND a.id = v.animal_id');
//     res.send(rows);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('An error occurred');
//   }
// });


// ////RETRIEVE BULLS 
// app.get('/animals', async (req, res) => {
//   try {
//     const [rows, fields] = await pool.execute('SELECT breed,DATEDIFF(currentdate(),birth_date) AS age FROM animals WHERE sex="MALE" ANIMAL AND DATEDIFF(currentdate(),birth_date) > 12 ' );
//     res.send(rows);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('An error occurred');
//   }
// });


// ////RETRIVE ACCORDING TO STATUS
// app.get('/animals', async (req, res) => {
//   const {status}=req.body;
//   try {
//     const [rows, fields] = await pool.execute('SELECT * FROM animals WHERE=?',[status]);
//     res.send(rows);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('An error occurred');
//   }
// });


// //RETRIEVE TOTAL COUNT
// app.get('/animals',async(req ,res)=>{
//   try{
//     const [rows,fields]=await pool.execute ('SELECT COUNT(animal_id) AS TOTAL FROM animals');
//     res.send(rows);
//     res.send(fields);
//   }catch{
//     console.log(error);
//     res.status(500).send('An error occurred');
//   }
// });

// ///UPDATE STATUS 
// app.get('/animals',async (req,res)=>{
//   const {status,id}=req.body;
//   try{
//     await pool.execute('UPDATE animals SET status=? WHERE id',[status,id])
//     res.send("Records updated");
//   }catch{
//     console.log(error);
//     res.status(500).send('An error occurred')
//   }
// });

// app.listen(process.env.PORT, () => console.log('app is running'));














































const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

app.use(cors());
app.use(bodyparser.json());

//database connection

const db = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'',
    database:'techservices',
    port:3306
});

//check dataabse connection

db.connect(err=>{
    if(err) 
    {
        console.log('error');
    }
    console.log('database connected...')
})

app.listen(3000,()=>{
    console.log('server running...');
})

//get all data

app.get('/staff',(req,res)=>{

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

app.get('/staff/:staff_id',(req,res)=>{

    let gID = req.params.staff_id;

    let qr = `select * from staff where staff_id = ${gID}`;

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

app.post('/staff',(req,res)=>{

console.log(req.body,'createdata');

let name = req.body.staff_name;
let email = req.body.email;
let phone = req.body.phone;
let office = req.body.office;
let job_title = req.body.job_title;
let gender = req.body.gender;
let deptid = req.body.department_id;

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

app.put('/staff/:id',(req,res)=>{

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

app.delete('/staff/:id',(req,res)=>{

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


//Get all Work request data

app.get('/work_request',(req,res)=>{

    let qr ='select * from work_request';

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


// Work_request single data using ID

// get single data

app.get('//:Work_request',(req,res)=>{

    let gID = req.params.Work_request;

    let qr = `select * from Work_request where id = ${gID}`;

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






























// //get all data

// app.get('/user',(req,res)=>{

//     let qr ='select * from request';

//     db.query(qr,(err,result)=>{

//         if(err)
//         {
//             console.log(err,'errs');
//         }
//         if(result.length>0)
//         {
//             res.send({
//                 message:'all user data',
//                 data:result
//             });
//         }

//     });
// });


// //get single data

// app.get('/request/:id',(req,res)=>{

//         let gID = req.params.id;

//         let qr = `select * from request where id = ${gID}`;

//         db.query(qr,(err,result)=>{
            
//             if(err) {console.log(err);}
            
//             if(result.length>0)
//             {
//                     res.send({
//                         message:'get single data',
//                         data:result
//                 });
//             }
//             else
//             {
//                     res.send({
//                         message:'data not found'
//                     });
//             }
//         });
// });

// // create data

// app.post('/request',(req,res)=>{

//         console.log(req.body,'createdata');

//         let aName = req.body.name;
//         let aBreed = req.body.breed;
//         let aEmail = req.body.email;
//         let aMobile = req.body.mobile;

//         let qr = `insert into request(name,breed,email,mobile)
//                     values('${aName}','${aBreed}','${aEmail}','${aMobile}')`;
//         console.log(qr,'qr')
//             db.query(qr,(err,result)=>{

//                     if(err){console.log(err);}
//                     console.log(result,'result')
//                     res.send({
//                         message:'data inserted',
//                     });
//             });
// });

// // update single data

// app.put('/request/:id',(req,res)=>{
    
//     console.log(req.body,'updatedata');

//     let gID = req.params.id;
//     let aName = req.body.name;
//     let aBreed = req.body.breed;
//     let aEmail = req.body.email;
//     let aMobile = req.body.mobile;

//     let qr = `update request set name = '${aName}', breed = '${aBreed}', email = '${aEmail}', mobile = '${aMobile}'
//              where id = ${gID}`;

//     db.query(qr,(err,result)=>{

//             if(err) {console.log(err);}

//             res.send({
//                 message:'data updated'
//             });
//     });        
// })


// //delete single data

// app.delete('/user/:id',(req,res)=>{

//     let qID = req.params.id;

//     let qr = `delete from animals where id = '${qID}'`;
//     db.query(qr,(err,result)=>{
//         if(err) {console.log(err);}

//         res.send(
//             {
//                 message:'data deleted'
//             }
//         )
//     });
// });



















