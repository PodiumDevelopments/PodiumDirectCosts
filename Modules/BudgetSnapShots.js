const fetch = require('node-fetch');
const fs = require("fs")


const DirectCost = async (ProcoreToken,ApiURL,ProjectId)=>{

    // var url = ApiURL+'/rest/v1.0/budget_views/436295/detail_rows?project_id='+ProjectId
    // url = ApiURL+'/rest/v1.0/projects/'+ ProjectId +'/direct_costs'
    url = ApiURL+'/rest/v1.0/budget_view_snapshots?project_id='+ProjectId

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


module.exports=DirectCost;

