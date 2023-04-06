const fetch = require('node-fetch');
const fs = require("fs")


const ProjectsList = async (ProcoreToken,ApiURL,CompanyID)=>{

    // var url = ApiURL+'/rest/v1.0/budget_views/436295/detail_rows?project_id='+ProjectId
    // url = ApiURL+'/rest/v1.0/projects/'+ ProjectId +'/direct_costs/38287947/line_items'
    url = ApiURL+'/rest/v1.0/projects?company_id='+CompanyID

    try{

   
    var res = await fetch(url,
        {
            method:"GET",
            headers: ProcoreToken,
        })
    }catch(e){
        console.log(e)
        
    }
    console.log(res.headers)
    let data = await res.json()
    
    return data
    
}


module.exports=ProjectsList;

