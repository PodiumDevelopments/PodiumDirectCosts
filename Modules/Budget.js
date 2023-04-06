const fetch = require('node-fetch');
const fs = require("fs")


const Budget = async (ProcoreToken,ApiURL,ProjectId,SnapshotID)=>{
    budgetview= 436295
    var url = ApiURL+'/rest/v1.0/budget_view_snapshots/'+SnapshotID+'/detail_rows?project_id='+ProjectId
    // var url= 'https://app.procore.com/projects/1141172/budgets/436295/snapshots/494437/cell_details/3234261?budget_line_item_id=22524509&budget_row_id=338900213'
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


module.exports=Budget;

