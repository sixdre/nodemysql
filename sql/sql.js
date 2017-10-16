var user = {  
    insert:'INSERT INTO user(name, password) VALUES(?,?)',  
    update:'update user set name=?, password=? where id=?',  
    delete: 'delete from user where id=?',  
    queryById: 'select * from user where id=?',  
    queryByNameAndPwd:'select id from user where name=? and password=?',  
    queryAll: 'select * from user'  
};  
   
module.exports = user;  