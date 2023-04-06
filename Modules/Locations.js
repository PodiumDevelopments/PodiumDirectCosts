const fetch = require('node-fetch');
const fs = require("fs")


const locations = async (ProcoreToken,ApiURL,ProjectId)=>{
    budgetview= 436295
    // var url = ApiURL+'/rest/v1.0/budget_views/'+budgetview+'/detail_rows?project_id='+ProjectId
    // url = ApiURL+'/rest/v1.0/projects/'+ ProjectId +'/direct_costs'
    url = ApiURL+`/rest/v1.0/projects/${ProjectId}/locations`

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
    console.log(res.headers)
    console.log(res.status)
    return data
    
}


module.exports=locations;

