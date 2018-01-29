// load required modules
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var PythonShell = require('python-shell');



// run the python script that creates the window to run the reader (via brian)
PythonShell.run('ReadRelax.py', function (err) {
  if (err) throw err;
  console.log('the function ran successfully');
});


// create the server, send messages for input 
http.createServer(function (req, res) {

  // creates a form for uploading files, allows the user to submit the file 
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = '/Users/fuad/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err; // confirm for the user that the file has been uploaded successfully 
        res.write('Book uploaded sucesfully!');
        res.end();
      });
 });
  } else {
    // post the form to the client via html form 
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<label for="file">Upload your book! :)</label>');    // let the user know what to upload
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();

    // how to send a file wtih http.createServer via express 
  }
}).listen(8080);