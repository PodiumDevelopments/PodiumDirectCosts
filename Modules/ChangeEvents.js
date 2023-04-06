const fetch = require('node-fetch');
const fs = require("fs")


const ChangeEvents = async (ProcoreToken,ApiURL,ProjectId)=>{
   
    // var url = ApiURL+'/rest/v1.0/budget_views/'+budgetview+'/detail_rows?project_id='+ProjectId
    // url = ApiURL+'/rest/v1.0/projects/'+ ProjectId +'/direct_costs'
    url = ApiURL+'/rest/v1.0/change_events?project_id='+ProjectId

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


module.exports=ChangeEvents;

