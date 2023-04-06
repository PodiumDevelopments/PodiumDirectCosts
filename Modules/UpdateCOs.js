const fetch = require('node-fetch');
const fs = require("fs")


const UpdateCOs = async (ProcoreToken,ApiURL,ProjectId)=>{

    OriginalDatafilename='./'+ProjectId+'_ChangeOrderDetails.json'
    JsonData=fs.readFileSync(OriginalDatafilename)
    JsonData=JSON.parse(JsonData)
    OriginalData=JsonData.changeorderslineitems
    lastrefreshed=JsonData.lastrefreshed
    DateNow = new Date(Date.now());
    DateNow=DateNow.toISOString()

    url = ApiURL+'/rest/v1.0/potential_change_orders?project_id='+ProjectId+'&filters[updated_at]='+lastrefreshed+'...'+ DateNow
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
    changeorderslineitems= await GetChangeOrderLineItems(ProcoreToken,ProjectId,data)

    async function GetChangeOrderLineItems(ProcoreToken,ProjectId,data){
        changeorderslineitems=[]
        for(var ChangeOrder of data){
            'add to removed updated COs from Original data'
            changeorderlineitem= await GetFromProcore(ProcoreToken,ProjectId,ChangeOrder.id)    
            console.log(changeorderlineitem)
            changeorderslineitems.push(changeorderlineitem)
        ;
        }
        return  changeorderslineitems
    }
    async function GetFromProcore(ProcoreToken,ProjectId,elementID){
        url = ApiURL+'/rest/v1.0/potential_change_orders/'+elementID+'/line_items?project_id='+ProjectId
            try{
                var res = await fetch(url,
                    {
                        method:"GET",
                        headers: ProcoreToken,
                    })
                }catch(e){
                    console.log(e)   
                }
                changeorderlineitem= await res.json()
                return changeorderlineitem
    }
    filename='./'+ProjectId+'_ChangeOrderDetails.json'

    const dateObject = new Date();
    lastrefreshed=dateObject
    SavedData={lastrefreshed:lastrefreshed,changeorderslineitems:OriginalData.push(changeorderslineitems)}
    fs.writeFileSync(filename, JSON.stringify(SavedData))

    return SavedData    
}


module.exports=UpdateCOs;

