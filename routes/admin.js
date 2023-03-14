const dbConnection = require('../config/connection');

module.exports = app => {

  const connection = dbConnection();

  app.get('/news', (req, res) => {
    connection.query('SELECT * FROM work_request', (err, result) => {
      res.render('request/request', {
        request: result
      });
    });
  });

  app.post('/request', (req, res) => {
    const { description, category,venue,image } = req.body;
    connection.query('INSERT INTO work_request SET ? ',
      {
        description,
        category,
        venue,
        image
      }
    , (err, result) => {
      res.redirect('/request');
    });
  });
};
