const dbConnection = require('../config/connection');

module.exports = app => {

  const connection = dbConnection();

///VIEW REQUESTS
  app.get("/request", (req, res) => {
    sql='SELECT * FROM work_request';
    connection.query(sql, (err, result) => {
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

  ////CREATE A REQUEST
  
  app.post("/request", (req, res) => {
    const { id,description,date, category,priority,location,image } = req.body;
    req.body.date=new date().toISOString().slice(0, 10);
    req.body.id=Date.now();
    const sql= `INSERT INTO work_request (description,date, category,priority,location,image)
    VALUES ('${id},${description}','${date}', '${category}','${priority}','${location}','${image}')`;
    connection.query(sql, (err, res)=> {
      if(err){
        throw err;
        res.send('Could not submitted a request');
      }else{
        res.send('Work request submitted');
      }
   })
  });
};

//**/