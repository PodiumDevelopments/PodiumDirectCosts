const fetch = require('node-fetch');
const fs = require("fs")


const InvoiceLineItems = async (ProcoreToken,ApiURL,ProjectId,InvoicesList)=>{
    try{
        return await GetLineItems(ProcoreToken,ApiURL,ProjectId,InvoicesList)
     
    }catch(err){
        console.log("caught something ")
        throw err
    }

}

async function GetLineItems (ProcoreToken,ApiURL,ProjectId,InvoicesList) {
    var urls=[]
   for (var item of InvoicesList) {
       urls.push(ApiURL+'/rest/v1.1/requisitions/'+ item.id +'?project_id='+ProjectId+"&view=extended")
   }
   DetailedLineitemslist=[]
   DetailedLineitems={}
   chunk=200
  
       for (i=0; i < urls.length; i += chunk) {
           
           let tempArray;
           tempArray = urls.slice(i, i + chunk);
           console.log(tempArray)
           try{
           DetailedLineitemslist=DetailedLineitemslist.concat(await  GetAllLineItems(ProcoreToken,tempArray))
           }catch(err){
            throw err
           }
       };
   
  
   const dateObject = new Date();
   DetailedLineitems.lastrefreshed=dateObject
   DetailedLineitems.DetailedLineitemslist=DetailedLineitemslist
  
   return DetailedLineitems
 }
 function GetAllLineItems(ProcoreToken,urls){   
       
    return new Promise((resolve,rejects)=>{
        var promises = urls.map(url => 
            
            fetch(url,{
            method:"GET",
            headers: ProcoreToken,
        }).then((res)=> {     
            if (res.status=res[Object.getOwnPropertySymbols(res)[1]].status==200){
               
            return res.json()
        }else{
            res.json().then( res=>{throw res}).catch(err=>{throw err})
        }}
            ).catch(err=>{console.log("found it")}))
        
        Promise.all(promises).then(results=>{
            resolve(results)
            }).catch(err=>{
                console.log("Error in getteing data"),
                console.log(err),
                rejects(err)
            });
    })
       
}

module.exports=InvoiceLineItems;

