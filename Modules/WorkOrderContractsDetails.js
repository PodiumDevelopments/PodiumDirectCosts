const fetch = require('node-fetch');
const fs = require("fs")


const WorkOrderContractsDetails = async (ProcoreToken,ApiURL,ProjectId,WorkOrdersList)=>{
    



    var url = ApiURL+'/rest/v1.0/work_order_contracts?project_id='+ProjectId+'&view=extended'
    // url = ApiURL+'/rest/v1.0/projects/'+ ProjectId +'/direct_costs'
    // url = ApiURL+'/rest/v1.0/requisitions?project_id='+ProjectId
   
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


module.exports=WorkOrderContractsDetails;

