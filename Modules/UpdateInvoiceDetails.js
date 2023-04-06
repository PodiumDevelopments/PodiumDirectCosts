const fetch = require('node-fetch');
const fs = require("fs");



const InvoiceLineItems = async (ProcoreToken,ApiURL,ProjectId,InvoicesList)=>{
DetailedLineitems=[];
    async function GetLineItems (ProcoreToken,ApiURL,ProjectId,InvoicesList) {
     DetailedLineitemslist = []
     DetailedLineitems={}   
    for (var Invoice of InvoicesList) {
      LineItems = await GetLineItemsFromProcre(ProcoreToken,ApiURL,ProjectId,Invoice)  
      DetailedLineitemslist=DetailedLineitemslist.concat(LineItems)
    }
    return DetailedLineitemslist
  }


    async function GetLineItemsFromProcre(ProcoreToken,ApiURL,ProjectId,Invoice){   
        try{
            
            url = ApiURL+'/rest/v1.1/requisitions/'+Invoice.id+'/?project_id='+ProjectId+'&view=extended'
            
            var res = await fetch(url,
            {
                method:"GET",
                headers: ProcoreToken,
            })
            }catch(e){
                    console.log(e)
                    }
        let data = await res.json()
       
        
        // directcostdata.lineitems=data
        // directcostdata.directcostinfo=item
        return data
    }
        
    
    DirectCostsInvoicesLineItems= await GetLineItems(ProcoreToken,ApiURL,ProjectId,InvoicesList)

    JsonDataFileName=ProjectID+"_InvoicesDetails.json"
    JsonDataFileName= './Data/'+JsonDataFileName
    JsonData=fs.readFileSync(JsonDataFileName)
    JsonData=JSON.parse(JsonData)
    OriginalData=JsonData.DetailedLineitemslist
    

    InvoicesList.forEach(Invoice=>{
        
       
        // MatchedData=OriginalData.findIndex((x) =>x[0].invoicid==Invoice.id)
        OriginalData.forEach((elem,index)=>{
            if (elem.id==Invoice.id &&elem.commitment_id==Invoice.commitment_id){
               
                
                OriginalData.splice(index,1)
            }
        })
        
       
        // console.log(MatchedData)
    })
    DirectCostsInvoicesLineItems.forEach(list=>{
        temparray=JsonData.DetailedLineitemslist
        temparray=temparray.concat(list)
        JsonData.DetailedLineitemslist=temparray
    })
    
    const dateObject = new Date();
    JsonData.lastrefreshed=dateObject
    filename='./Data/'+ProjectId+'_InvoicesDetails.json'
    
    fs.writeFileSync(filename, JSON.stringify(JsonData),err=>{
        if(err){
            console.log(err)
        }
    })
    return JsonData
    // // var url = ApiURL+'/rest/v1.0/budget_views/436295/detail_rows?project_id='+ProjectId
    // url = ApiURL+'/rest/v1.0/projects/'+ ProjectId +'/direct_costs/'+DirectCostID+'/line_items'
    // // url = ApiURL+'/rest/v1.0/requisitions?project_id='+ProjectId


}


module.exports=InvoiceLineItems;

