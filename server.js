var express = require('express');

var app = express();

//mysql连接
var mysql = require('mysql')

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

app.get('./form.html', function(req, res) {
	console.log(123)
	res.sendFile("form.html" )
})

app.get('/process_get', function (req, res) {

	//输出json
	var response = {
		"first_name": req.query.first_name,
		"last_name": req.query.last_name
	}

	console.log(response);

	res.end(JSON.stringify(response));

})

//post请求 返回参数,普通的数据库连接
app.post('/getlist', urlencodedParser, function (req, res) {
	var connection;
	//连接数据库
	connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'djycba',
		port: 3306,
		database : 'world'

	})

	connection.connect();

	//限定数据记录每次查询获取失调

	var sql = 'select * from country where name like ? limit ?, 10'
	console.log(req.body.pageNum)
	var modSqlParams  = ['%' + req.body.countryName + '%', Number(req.body.pageNum)]
	// console.log(sql)
	connection.query(sql, modSqlParams, function (err, result) {
		if (err) {
			console.log(err)
		}
		// console.log(result)
		res.end(JSON.stringify({returncode: 0, data: result}))
		connection.end()
	})

})

//连接池连接
app.get('/getCountryList', function (req, res) {

	var sqlPool = mysql.createPool({
				host: 'localhost',
				user: 'root',
				password: 'djycba',
				port: 3306,
				database : 'world',
				multipleStatements: true
	})

	//分页获取数据sql
	var sqlGetList = 'select * from country where name like ? limit ?, 10;select count(*) as totalNum from country'

	var modSqlParams  = ['%' + req.query.countryName + '%', Number(req.query.pageNum)]

	sqlGetList = mysql.format(sqlGetList, modSqlParams)

	//获取所有记录数量
	var getTotalNum = 'select count(*) from country'

	sqlPool.getConnection(function (err, conn) {
		if (err) {
			res.end(err)		
		} else {
			conn.query(sqlGetList, function (err, result) {

				conn.release()

				res.end(JSON.stringify({returncode: 0, data: result[0], totalNum: result[1][0].totalNum}))

			})
		}
	})

	// console.log(req.query)
	// res.end(JSON.stringify(req.query))
})


var server = app.listen(8007, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})