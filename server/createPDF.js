'use strict';

const path = require('path'),
      PDFDocument = require ('pdfkit');

const createPDF = function(request, res){
    
    const doc = new PDFDocument({layout:"landscape", size:"A4"});
    doc.image(path.join(__dirname,'./assets/command.png'), 0, 0, {width: "842"});
    doc.font(path.join(__dirname,'./assets/arial.ttf'))
       .fontSize(10)
       .text(request.provider, 490, 37)
       .text("Rue des colonnies 101", 490, 47)
       .text("1000 Bruxelles", 490, 58)
       .text("022731549", 490, 68)
       .text("info@print24.be", 555, 68)
       .text("Bruxelles, le 13 juin 2017", 590, 102)
       .text(request.budget, 86, 460);
    for(let i = 0, y = 142; i < request.products.length; i++){
        doc.text(request.products[i].description, 153, y)
           .text(request.products[i].amount, 387, y)
           .text(request.products[i].price+"€", 421, y)
           .text((request.products[i].price*request.products[i].amount)+"€", 688, y)
           .text("21", 756, y);
        y += 11.3;
    }
    doc.fontSize(12)
       .text(request.totalPrice+"€", 616, 352);
    doc.image(path.join(__dirname,'./assets/sign.png'), 375, 510, {width: "120"});
    doc.end();
    
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=bon_de_commande.pdf'
    });
    
    return doc.pipe(res);
    
};

module.exports = {
    createPDF: createPDF
};