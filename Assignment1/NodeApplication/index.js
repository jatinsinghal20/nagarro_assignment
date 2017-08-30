var express = require("express"),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    fs = require("fs"),
    path = require("path");

var app = express();

const PORT = 3000;

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

app.use(morgan('tiny'));

app.set("view engine","pug");

app.use('/', bodyParser.urlencoded({extended: false}));
app.use('/assets',express.static(__dirname+"/public"));


app.get('/form', function (req,res) {
    res.sendFile(__dirname+"/public/form.html");
});

app.post('/submit', function (req,res) {
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(req.body.DOB);
    var diffDays = Math.round(Math.abs((firstDate.getTime() - Date.now())/(oneDay)));
    res.render("submit",{name:req.body.name, days : diffDays });
});


app.get('*', function (req,res) {
   res.send("Hello from Jatin Singhal",404);
});


app.listen(PORT);
console.log("Server running on port 3000");