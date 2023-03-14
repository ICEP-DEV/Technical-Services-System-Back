const dbConnection = require('../config/connection');

module.exports = app => {

  const connection = dbConnection();

  app.get("/request", (req, res) => {
    connection.query('SELECT * FROM work_request', (err, result) => {
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
    const { description,date, category,priority,location,image } = req.body;
    req.body.date=new date;
    const sql= `INSERT INTO user (description,date, category,priority,location,image)
    VALUES ('${description}','${date}', '${category}','${priority}','${location}','${image}')`;
    connection.query(sql, (err, res)=> {
      if(err){
        throw err
      }else{
        res.send('Work request created');
      }
   })
  });
};
