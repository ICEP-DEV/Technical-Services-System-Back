const dbConnection = require('../config/connection');


module.exports = app => {
  const connection = dbConnection();
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**                                     TECHNICIAN VIEWS TASKS ASSIGNED THEM                                                    */  
  app.get('/myTasks',(req,res)=>{
    const sql="SELECT w.description, w.priority, w.venue, w.category FROM work_request w,technician t WHERE w.tech_id = t.id;"
    connection.query(sql,(err,result)=>{
      if(err){
        throw err;
      }
      res.send(result);
    })
   })

   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**                                     TECHNICIAN UPDATE THEIR PROGRESS OF TASK                                                 */
  app.put('updateTask',(req,res)=>{
    const sql="UPDATE work_order SET status=? WHERE tech_id ";
    connection.query(sql,(err,result)=>{
      if(err){
          throw err;
      }
      res.send(result);
    })
  })
}