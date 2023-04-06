const fetch = require('node-fetch');
const fs = require("fs");
const { resolve } = require('path');
const { rejects } = require('assert');
const { error } = require('console');

'unfinished'
async function UpdateInvoice(ProjetID,InvoiceID){
    try{
   Data = await getLocalDB(ProjetID)
   
   
        }catch(err){console.log(err)}
   
}

 function DeleteInvoice(ProjetID,InvoiceID){
    return new Promise(async (resolve,rejects)=>{
    try{
   Data = await getLocalDB(ProjetID)
    }catch(err){
        rejects({error:"Can't find project data"})
        return
    }
   let isfound=false
   for( const [i,invoice] of Data.DetailedLineitemslist.entries()){
    if (invoice.id==InvoiceID){
        console.log(Data.DetailedLineitemslist)
        Data.DetailedLineitemslist.splice(i,1)
        console.log(Data.DetailedLineitemslist)
        console.log(`Invoice ${InvoiceID} from Proejct ${ProjetID} was deleted`)
        WriteLocalDB(ProjetID,Data).catch((err)=>{
            rejects(err)
        })
        isfound=true
        resolve()
        }
      }
   if (isfound==false){
    console.log(`Invoice ${InvoiceID} from Proejct ${ProjetID} was not found to be deleted`)
    rejects({error:`Invoice ${InvoiceID} from Proejct ${ProjetID} was not found to be deleted`})
   }
        
})
}


function getLocalDB(ProjectID){
    return new Promise((resolve,rejects)=>{
        filename='./Data/'+ProjectID+'_InvoicesDetails.json'
        try{
        db=JSON.parse(fs.readFileSync(filename))
        resolve( db)
        }catch(err){
            rejects(err)
        }
    }) 
}

function WriteLocalDB(ProjectID,Data){
    return new Promise((resolve,rejects)=>{
        filename='./Data/'+ProjectID+'_InvoicesDetails.json'
        try{
            fs.writeFileSync(filename, JSON.stringify(Data),err=>{
                if(err){
                    console.log(err)
                }resolve()})
        
        }catch(err){
            rejects(err)
        }
    }) 
}




module.exports={
    UpdateInvoice:UpdateInvoice,
    DeleteInvoice:DeleteInvoice
}




