var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'djycba',
  database : 'world'
});

connection.connect();

connection.query('SELECT * FROM country WHERE Name = "china"', function (error, result, fields) {
	console.log('query callback')
	if (error) {throw error};
	console.log(result)
})
console.log('query end')
connection.end()