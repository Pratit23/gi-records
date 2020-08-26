var http = require("http");
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');
var router = express.Router();
//const router = require("./routes/routes")

const SELECT_ALL_QUERY = 'SELECT * FROM info';

const {HOST, DATABASE, PASSWORD, USER} = require("./keys/keys.js")

const connection = mysql.createConnection({
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


function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, () => args[i++]);
}

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log("Listening to request on port", PORT)
})

router.get('/', function (req, res) {
    //const SELECT_HASH_QUERY = ('select * from info where hash = ?', hash)
    connection.query('select * from info where hash= ' + '\'' +req.query.hash+'\'', function(error, results, fields) {
    if (error) throw error;
    console.log(results)
    res.json(results);
  });
 });

 router.get('/delete', function (req, res) {
    //const SELECT_HASH_QUERY = ('select * from info where hash = ?', hash)
    connection.query('delete from info where hash= ' + '\'' +req.query.hash+'\'', function(error, results, fields) {
    if (error) throw error;
    console.log(results)
    res.json(results);
  });
 });

 router.get('/check', function (req, res) {
    //const SELECT_HASH_QUERY = ('select * from info where hash = ?', hash)
    connection.query('select from price where locality= ' + '\'' +req.query.locality+'\' and mon= '+ '\''+req.query.mon+'\' and city= '+'\''+req.query.city+'\'', function(error, results, fields) {
    if (error) throw error;
    console.log(results)
    res.json(results);
  });
 });



// router.get('/Database', function(req, res, next) {
//     res.locals.connection.query('select * from info', function (error, results, fields) {
//         console.log(error, results);
//         if(error) throw error;
//         res.send(JSON.stringify(results));
//     });
// });

app.use(router)


// var server = app.listen(3000, "127.0.0.1", function () {
//     var host = server.address().address
//     var port = server.address().port
//     console.log("Example app listening at http://%s:%s", host, port)
// });