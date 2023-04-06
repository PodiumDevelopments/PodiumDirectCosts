const fetch = require('node-fetch');
const fs = require("fs")


const CompanyVendors = async (ProcoreToken,ApiURL,CompanyID)=>{
    budgetview= 436295
    // var url = ApiURL+'/rest/v1.0/budget_views/'+budgetview+'/detail_rows?project_id='+ProjectId
    url = ApiURL+'/rest/v1.0/vendors?company_id='+CompanyID
    // url = ApiURL+'/rest/v1.0/purchase_order_contracts?project_id='+ProjectId
   
    try{

   
    var res = await fetch(url,
        {
            method:"GET",
            headers: {...ProcoreToken, 'Procore-Company-Id':CompanyID}
        })
    }catch(e){
        console.log(e)
        
    }

    let data = await res.json()
    
    return data
    
}


module.exports=CompanyVendors;

