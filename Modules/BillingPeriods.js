const fetch = require('node-fetch');
const fs = require("fs")


const BillingPeriods = async (ProcoreToken,ApiURL,ProjectId)=>{
    budgetview= 436295
    // var url = ApiURL+'/rest/v1.0/budget_views/'+budgetview+'/detail_rows?project_id='+ProjectId
    url = ApiURL+'/rest/v1.0/projects/'+ ProjectId +'/billing_periods'
    // url = ApiURL+'/rest/v1.0/purchase_order_contracts?project_id='+ProjectId

    try{

   
    var res = await fetch(url,
        {
            method:"GET",
            headers: ProcoreToken,
        })
    }catch(e){
        console.log(e)
        
    }

    let data = await res.json()
    
    return data
    
}


module.exports=BillingPeriods;

