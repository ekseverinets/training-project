var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('contactlist',['contactlist']);
var bodyParser = require('body-parser');
var sessions = require('express-session');

var session;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.use(sessions({
	secret: '123456789',
	resave: false,
	saveUninitialized: true
}))

app.get('/login', function(req, res) {
	if(session.uniqueID) {
		res.redirect('/redirects');
	}
	res.sendFile('../public/templates/login.html', {root: __dirname});
});

app.post('/login', function(req, res) {
	session = req.session;
	if(session.uniqueID) {
		res.redirect('/redirects');
	}
	session.uniqueID = req.body.username;
	res.redirect('/redirects');
});

app.get('/logout', function(req, res){
	req.session.destroy();
	res.redirect('/#!/login');
});

app.get('/admin', function(req, res) {
	session = req.session;
	if(session.uniqueID != 'admin') {
		res.send('Unauthorized access <a href="/logout">Try again</a>');
	}
});

app.get('/redirects', function(req, res) {
	session = req.session;
	if(session.uniqueID == 'admin') {
		console.log(session.uniqueID);
		res.redirect('/#!/contactlist');
	} else {
		res.send(req.session.uniqueID + ' not found <a href="/logout">Try again</a>');
	}
});


/* Contacts List */
app.get('/contactlist', function (req, res) {
    console.log("I received a GET request");

    db.contactlist.find(function (err, docs) {
        console.log(docs);
        res.json(docs);
    });
});

app.post('/contactlist', function (req, res) {
    console.log(req.body);
    db.contactlist.insert(req.body, function(err,doc){
        res.json(doc);
    });
});

app.delete('/contactlist/:id', function (req, res) {
    var id = req.params.id;
		console.log(id);
		db.contactlist.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
			res.json(doc);
		});
});

app.get('/contactlist/:id', function (req, res) {
	var id = req.params.id;
	console.log(id);
	db.contactlist.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
		res.json(doc);
	});
});

app.put('/contactlist/:id', function (req, res) {
	var id = req.params.id;
	console.log(req.body.name);
	db.contactlist.findAndModify({
		query: {_id: mongojs.ObjectId(id)},
		update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}}, 
		new: true}, function (err, doc) {
			res.json(doc);
		});
});

app.listen(3000);
console.log("Server running on port 3000");