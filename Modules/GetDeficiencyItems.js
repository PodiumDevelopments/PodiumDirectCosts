const fetch = require('node-fetch');
const fs = require("fs")


const GetDeficiencyItems = async (ProcoreToken,ApiURL,ProjectId)=>{

    var url = ApiURL+'/rest/v1.1/punch_items/?project_id='+ProjectId
    
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


module.exports=GetDeficiencyItems;

