const fetch = require('node-fetch');
const fs = require("fs");
const { resolve } = require('path');
const { rejects } = require('assert');
const { error } = require('console');

'unfinished'
async function UpdateInvoice(ProjetID,InvoiceID,ProcoreToken){
    try{
        Data = await getLocalDB(ProjetID)
     }catch(err){
        rejects({error:"Can't find project data"})
        return
    }
    NewInvoiceData= await GetDirectCostInvoiceLineItems(ProjetID,InvoiceID,ProcoreToken)
    
    let isUpdate=false
    for( const [i,invoice] of Data.DetailedLineitemslist.entries()){
        if (invoice[0].invoicid==InvoiceID){
            
            Data.DetailedLineitemslist.splice(i,1)
            
            Data.DetailedLineitemslist.splice(i,0,NewInvoiceData)
           
            console.log(`Invoice ${InvoiceID} from Proejct ${ProjetID} was updated`)
            WriteLocalDB(ProjetID,Data).catch((err)=>{
                rejects(err)
            })
            isfound=true
            resolve()
            }
          }
   
}

async function UpdateLineitemInvoice(ProjetID,LineItem,ProcoreToken){
    try{
        Data = await getLocalDB(ProjetID)
     }catch(err){
        rejects({error:"Can't find project data"})
        return
    }
    
    for( const invoice of Data.DetailedLineitemslist){
        invoice.forEach(lineitem=>{
            if(lineitem.id==LineItem){
               
                UpdateInvoice(ProjetID,lineitem.invoicid,ProcoreToken)
                return
            }
        })
          }


}


async function CreateLineitemInvoice(ProjetID,LineItem,ProcoreToken){
    try{
        Data = await getLocalDB(ProjetID)
     }catch(err){
        rejects({error:"Can't find project data"})
        return
    }
    
    for( const invoice of Data.DetailedLineitemslist){
        for (lineitem of invoice)
            if(lineitem.id==LineItem){
               
                NewInvoiceData= await GetDirectCostInvoiceLineItems(ProjetID,InvoiceID,ProcoreToken)
                tempArray=Data.DetailedLineitemslist
                tempArray.concat(NewInvoiceData)
                Data.DetailedLineitemslist=tempArray
                WriteLocalDB(ProjetID,Data).catch((err)=>{
                    rejects(err)
                }).then(()=>{return})
                
            }
        }
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
    if (invoice[0].invoicid==InvoiceID){
        
        Data.DetailedLineitemslist.splice(i,1)
        
    
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
        filename='./Data/'+ProjectID+'_directcost.json'
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
        filename='./Data/'+ProjectID+'_directcost.json'
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

 function GetDirectCostInvoiceLineItems(ProjetID,InvoiceID,ProcoreToken){
     return new Promise(async (resolve, reject) => {
        try{
        url = ApiURL + '/rest/v1.0/projects/' + ProjetID + '/direct_costs/' + InvoiceID + '/line_items'
        var res = await fetch(url,
            {
                method: "GET",
                headers: ProcoreToken,
            })
    } catch (e) {
        console.log(e)
    }
    let data = await res.json()
    directcostdata = []
    console.log(data)
    try{
    data.forEach(elem => {
        elem.invoicid = InvoiceID
        directcostdata.push(elem)
    })
    resolve(directcostdata)
    }catch(err){resolve(err)}   
    })
}


module.exports={
    UpdateInvoice:UpdateInvoice,
    DeleteInvoice:DeleteInvoice,
    UpdateLineitemInvoice:UpdateLineitemInvoice,
    CreateLineitemInvoice:CreateLineitemInvoice
}




