const fetch = require('node-fetch');
const fs = require("fs")


const Invoices = async (ProcoreToken,ApiURL,ProjectId,GetDatafromDate)=>{
    
    
    if (GetDatafromDate){
        DateNow = new Date(Date.now());
        DateNow=DateNow.toISOString()
        url = ApiURL+'/rest/v1.0/requisitions?project_id='+ProjectId+'&filters[updated_at]='+GetDatafromDate+'...'+ DateNow
    }else{
        url = ApiURL+'/rest/v1.0/requisitions?project_id='+ProjectId+'&view=extended'

    }
    // var url = ApiURL+'/rest/v1.0/budget_views/436295/detail_rows?project_id='+ProjectId
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

    if (res.status=res[Object.getOwnPropertySymbols(res)[1]].status==200){
        console.log(res[Object.getOwnPropertySymbols(res)[1]].status)
    let data = await res.json()
    return data
}else{
    let data = await res.json()
   
   throw Error(JSON.stringify(data))
}
}


module.exports=Invoices;

