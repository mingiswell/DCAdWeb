var express = require('express');
var app = express();
var fs = require("fs");

var bodyParser = require('body-parser');
var multer = require('multer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(multer({
  dest: '/tmp/'
}).array('image'));


var location = '/views/uploadfile.htm'
app.get('/views/uploadfile.htm', function(req, res) {
  res.sendFile(__dirname + "/" + "/views/uploadfile.htm");
})

app.post('/process_post', function(req, res) {

  console.log(req.files[0]); // console the upload file info

  response = {
    censusDate: req.body.txtCensusDate,
    projectType: req.body.dllProjectType,
    address: {
      "streetAddress": "21 2nd Street",
      "city": "New York",
      "state": "NY",
      "postalCode": "10021-3100"
    },
  };

  var des_file = __dirname + "/testJSON.json";

  var obj = {};
  obj = response;
  console.log(JSON.stringify(obj));

  fs.readFile(req.files[0].path, function(err, data) {
    fs.writeFile(des_file, JSON.stringify(obj), function(err) {
      if (err) {
        console.log(err);
      } else {
        response = {
          message: 'File uploaded successfully',
          filename: req.files[0].originalname
        };
      }
      console.log(response);
      res.end(JSON.stringify(response));
    });
  });
})

var server = app.listen(8000, function() {
  var host = server.address().address
  var port = server.address().port
  console.log("please visit http://%s:%s", host, port)
})