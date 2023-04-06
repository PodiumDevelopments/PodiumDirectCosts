const fetch = require('node-fetch');
const fs = require("fs")


const DirectCost = async (ProcoreToken,ApiURL,ProjectId,InvoiceList)=>{
    promisesUrls=[]
    
    for (const invoice of InvoiceList ){
        url = ApiURL+'/rest/v1.0/projects/'+ ProjectId +'/direct_costs/'+ invoice.id
        promisesUrls.push(url)
    }
    var promises= promisesUrls.map(url=>{
        return GetInvoice(url,ProcoreToken).then(data=>{
            return data
        })
    })

    return Promise.all(promises).then(results=>{
        return results
    })

    
  
}

async function GetInvoice(url,ProcoreToken){
    return new Promise(async (resolve, reject) => {
        try{
            var res = await fetch(url,
                {
                    method:"GET",
                    headers: ProcoreToken,
                })
            }catch(e){
                reject(e)    
            }
            let data = await res.json()
            resolve(data)
    })
    
}
module.exports=DirectCost;

