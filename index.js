var http = require("http");
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');
var router = express.Router();
const Razorpay = require('razorpay')
const shortid = require('shortid')
//const router = require("./routes/routes")

const SELECT_ALL_QUERY = 'SELECT * FROM info';

const { HOST, DATABASE, PASSWORD, USER } = require("./keys/keys.js")

const connection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
});

const razorpay = new Razorpay({
	key_id: 'rzp_test_drE1kuhaA651IE',
	key_secret: 'DnwmzKThr6zIOV0wFRdLM1kC'
})

connection.connect(function (err) {
    if (err) throw err
    console.log('You are now connected with mysql database...')
})

app.use(cors())
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// var dict = {
//     state: 'Maharashtra',
//     city: 'Kudal',
//     locality: 'Kudal MIDC',
//     rate: '102',
//     mon: '2020-08-09'
// }

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
    connection.query('select * from info where hash= ' + '\'' + req.query.hash + '\'', function (error, results, fields) {
        if (error) throw error;
        console.log(results)
        res.json(results);
    });
});

router.get('/delete', function (req, res) {
    //const SELECT_HASH_QUERY = ('select * from info where hash = ?', hash)
    connection.query('delete from info where hash= ' + '\'' + req.query.hash + '\'', function (error, results, fields) {
        if (error) throw error;
        console.log(results)
        res.json(results);
    });
});

router.get('/setPrice', function (req, res) {
    console.log("Req dict: ", req.query.state)
    console.log("Set price route is running")
    //const SELECT_HASH_QUERY = ('select * from info where hash = ?', hash)
    connection.query('insert into price(state, city, locality, rate, mon) values ( ' + '\'' + req.query.state + '\',' + '\'' + req.query.city + '\',' + '\'' + req.query.locality + '\',' + '\'' + req.query.rate + '\', ' + '\'' + req.query.mon + '\');', function (error, results, fields) {
        //connection.query('insert into price SET ?', req.query.dict , function(error, results, fields) {
        if (error) throw error;
        console.log(results)
        res.json(results);
    });
});

app.post('/razorpay', async (req, res) => {
    const payment_capture = 1
    const amount = 499
    const currency = 'INR'

    const options = {
        amount: amount * 100,
        currency,
        receipt: shortid.generate(),
        payment_capture
    }

    try {
        const response = await razorpay.orders.create(options)
        console.log(response)
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount
        })
    } catch (error) {
        console.log(error)
    }
})

app.post('/verification', (req, res) => {
	// do a validation
	const secret = 'VEN9ka$tesh'

	console.log(req.body)

	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
})

app.use(router)

 // router.get('/Database', function(req, res, next) {
 //     res.locals.connection.query('select * from info', function (error, results, fields) {
 //         console.log(error, results);
 //         if(error) throw error;
 //         res.send(JSON.stringify(results));
 //     });
 // });

 // var server = app.listen(3000, "127.0.0.1", function () {
     //     var host = server.address().address
     //     var port = server.address().port
     //     console.log("Example app listening at http://%s:%s", host, port)
     // });