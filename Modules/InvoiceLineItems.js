

const fetch = require('node-fetch');
const fs = require("fs")


const InvoiceLineItems = async (ProcoreToken,ApiURL,ProjectId,InvoicesList)=>{

    // var url = ApiURL+'/rest/v1.0/budget_views/436295/detail_rows?project_id='+ProjectId
    // url = ApiURL+'/rest/v1.0/projects/'+ ProjectId +'/direct_costs'
    // url = ApiURL+'/rest/v1.0/requisitions/7498734/detail?project_id='+ProjectId

    DetailedLineitems=[];

    async function GetLineItems (ProcoreToken,ApiURL,ProjectId,InvoicesList) {
     DetailedLineitemslist = []
     DetailedLineitems={}   
    for (var item of InvoicesList) {
       
      LineItems = await asyncFunction(ProcoreToken,ApiURL,ProjectId,item)
      
      DetailedLineitemslist.push(LineItems)
    }
    const dateObject = new Date();
    DetailedLineitems.lastrefreshed=dateObject
    DetailedLineitems.DetailedLineitemslist=DetailedLineitemslist
   
    return DetailedLineitems
  }


    async function asyncFunction(ProcoreToken,ApiURL,ProjectId,item){   
        try{
            // url = ApiURL+'/rest/v1.0/requisitions/7498734/detail?project_id='+ProjectId
            url = ApiURL+'/rest/v1.1/requisitions/'+ item.id +'?project_id='+ProjectId+"&view=extended"
            
            var res = await fetch(url,
            {
                method:"GET",
                headers: ProcoreToken,
            })
            }catch(e){
                    console.log(e)
                    }
        let data = await res.json()
        // directcostdata=[]
        // data.forEach(elem =>{
        //     elem.invoicid=item.id
        //     elem.commitment_id=item.commitment_id
        //     directcostdata.push(elem)
        // })
        // directcostdata.lineitems=data
        // directcostdata.directcostinfo=item
        return data
    }
        
    
    data = await GetLineItems(ProcoreToken,ApiURL,ProjectId,InvoicesList)
    filename='./Data/'+ProjectId+'_InvoicesDetails.json'
    fs.writeFileSync(filename, JSON.stringify(data),err=>{
        if(err){
            console.log(err)
        }
    })
    return data
    // // var url = ApiURL+'/rest/v1.0/budget_views/436295/detail_rows?project_id='+ProjectId
    // url = ApiURL+'/rest/v1.0/projects/'+ ProjectId +'/direct_costs/'+DirectCostID+'/line_items'
    // // url = ApiURL+'/rest/v1.0/requisitions?project_id='+ProjectId


}


module.exports=InvoiceLineItems;

