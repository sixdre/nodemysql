var express = require('express');
var router = express.Router();
var db = require('../config/db')


/* GET home page. */
router.get('/', function(req, res, next) {
	db.query('SELECT * FROM user',  function (error, results, fields) {
		if (error) throw error;
		res.render('index', { userList: results });
	});

});


module.exports = router;
