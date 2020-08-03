var http = require("http");
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');

const SELECT_ALL_QUERY = 'SELECT * FROM info';

const {HOST, DATABASE, PASSWORD, USER} = require("./keys/keys")

var connection = mysql.createConnection({
    host: HOST,
    user: USER, 
    password: PASSWORD,
    database: DATABASE
});

connection.connect(function (err) {
    if (err) throw err
    console.log('You are now connected with mysql database...')
})

app.use(cors())

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Listening to request on port", PORT)
})

//route for insert data
//route for insert data
app.get('/Dashboard', function (req, res) {
    connection.query('select * from info', function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
 });

// var server = app.listen(3000, "127.0.0.1", function () {
//     var host = server.address().address
//     var port = server.address().port
//     console.log("Example app listening at http://%s:%s", host, port)
// });