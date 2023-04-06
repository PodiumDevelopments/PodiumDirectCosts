const fetch = require('node-fetch');
const fs = require("fs")


const WOs = async (ProcoreToken,ApiURL,ProjectId)=>{
    budgetview= 436295
    // var url = ApiURL+'/rest/v1.0/budget_views/'+budgetview+'/detail_rows?project_id='+ProjectId
    // url = ApiURL+'/rest/v1.0/projects/'+ ProjectId +'/direct_costs'
    url = ApiURL+'/rest/v1.0/work_order_contracts?project_id='+ProjectId+'&view=extended'

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


module.exports=WOs;

