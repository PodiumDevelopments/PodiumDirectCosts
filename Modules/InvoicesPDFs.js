
const fetch = require("node-fetch");
const fs = require("fs");
const archiver = require("archiver");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

const getpdfszip=function getPdfs(pdfs,tempdir){

    var promises= pdfs.map(invoice=>{
        return downloadPDF(invoice,tempdir).then(()=>{
            return
        })
    })



    return Promise.all(promises).then(async () => {
     await zipDirectory(tempdir,`./tempinvoices.zip`)
})

}

function downloadPDF(Invoice,tempdir){
  
    return new Promise((resolve, reject) => {    
        let url=        Invoice.InvoiceURL
        let invoicename =Invoice.InvoiceRename
        let invwatermark=  Invoice.Watermark
        try{
        fetch(url)
        .then((response) => response.buffer())
        .then((file) => {
            console.log(invoicename)
            console.log(url)
            dir=`${tempdir}/${invoicename}.pdf`
          fs.writeFileSync(dir, file);
          stamppdf(dir,invwatermark).then(()=>{
            
            console.log("im turining")
            resolve()
          }).catch(err=>{

            console.log(err)
          })
          
    }) }catch(err){
        reject(err)
    }
})}

function zipDirectory(sourceDir, outPath) {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);
  
  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on("error", (err) => reject(err))
      .pipe(stream);
    stream.on("close", () => resolve());
    archive.finalize();
  });
}

function stamppdf(path,stamp){
  return new Promise(async (resolve, reject) => {
  
  const document = await PDFDocument.load(fs.readFileSync(path));
  const courierBoldFont = await document.embedFont(StandardFonts.CourierBold);
  const textSize = 14
  const textWidth = courierBoldFont.widthOfTextAtSize(stamp, textSize)+10
  const textHeight = courierBoldFont.heightAtSize(textSize)+10
  const firstPage = document.getPage(0);
  const { width, height } = firstPage.getSize()
  firstPage.drawText(stamp, {
    x:20,
    y:height-15,
    font: courierBoldFont,
    size: 10,
    color: rgb(1,0,0.2)
  });

  // firstPage.drawRectangle({
  //   x: 48,
  //   y: height-25,
  //   width: textWidth,
  //   height: textHeight,
  //   borderColor: rgb(1, 0, 0),
  //   borderWidth: 2,
  // })
  fs.writeFileSync(path, await document.save());
  resolve()
  })
   
}
// "https://storage.procore.com/v4/d/us-east-1/pro-core.com/prostore/20220627133350_production_3444108623.pdf?sig=d25a1864836871196a4edb48974cd1c4356c158806023c3e14a5c7c0429668b3";
// app.post("/", (req, res) => {
//   fetch(url)
//     .then((response) => response.buffer())
//     .then((file) => {
//       fs.writeFileSync("./pdffile.pdf", file);
//       res.status(200).download("./pdffile.pdf");
//     });
// });


module.exports=getpdfszip