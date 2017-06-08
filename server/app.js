'use strict';

const express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      PDFDocument = require ('pdfkit'),
      logger = require('morgan'),
      fs = require('fs'),
      app = express();
      
app.use(bodyParser.json());
app.use(logger("dev"));

app.get('/validation', function(req, res){
    
    const doc = new PDFDocument;

    doc.pipe(fs.createWriteStream('output.pdf'));
    
    doc.font(path.join(__dirname,'./fonts/arial.ttf'))
       .fontSize(25)
       .text('This shit is awesome dude!', 100, 100);
    
    doc.addPage()
       .fontSize(25)
       .text('Hello boy !', 100, 100);
    
    doc.save()
       .moveTo(100, 150)
       .lineTo(100, 250)
       .lineTo(200, 250)
       .fill("#FF3300");
    
    doc.scale(0.6)
       .translate(470, -380)
       .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
       .fill('red', 'even-odd')
       .restore();
    
    doc.end();
    
    doc.pipe(res);

});


app.use(function(err,req,res,next){
  res.status(err.status || 500);
  res.json({
    error : {
      message : err.message
    }
  });
});

app.listen(process.env.PORT || 8080, function(){
  console.log('Server running');
});