const fetch = require('node-fetch');
const fs = require("fs")


const CheckLimit = async (ProcoreToken,ApiURL,ProjectId)=>{
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
    
    limits={
        limit: res.headers.get('x-rate-limit-limit'),
        limit_remain: res.headers.get('x-rate-limit-remaining'),
        limit_reset: res.headers.get('x-rate-limit-reset')
    }
   


    let data = await res.json()
    
    return limits
    
}


module.exports=CheckLimit;

