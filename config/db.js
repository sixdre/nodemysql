var mysql = require("mysql");
var pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"123456",
    database:"test"
});

//@params sql 查询语句
function query(sql,dt){
	return new Promise((resolve,reject)=>{
		pool.getConnection(function(err,connection){
			if(err){
				reject(err);
				return ;
			}
			if(!dt){
				connection.query(sql, function (err,rows) {
		        	if(err){
						reject(err);
						return ;
					}
		            resolve(rows)
		            connection.release();
		        });
			}else{
				connection.query(sql,dt, function (err,rows) {
		        	if(err){
						reject(err);
						return ;
					}
		            resolve(rows)
		            connection.release();
		        });
			}
	        
	    });
	})
//  pool.getConnection(function(err,connection){
//      connection.query(sql, function (err,rows) {
//          callback(err,rows);
//          connection.release();
//      });
//  });
}




exports.query = query;