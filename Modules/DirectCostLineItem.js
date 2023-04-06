const fetch = require('node-fetch');
const fs = require("fs");

const DirectCostLineItem = async (ProcoreToken,ApiURL,ProjectId,DirectCostList)=>{

try{


    async function GetLineItems (ProcoreToken,ApiURL,ProjectId,DirectCostList) {
    urls=[]
    for (var item of DirectCostList) {
        urls.push(ApiURL+`/rest/v1.0/projects/${ProjectId}/direct_costs/${item.id}/line_items`)
    }
    DetailedLineitemslist=[]
    DetailedLineitems={}
    chunk=200
    for (i=0; i < urls.length; i += chunk) {
        let tempArray;
        tempArray = urls.slice(i, i + chunk);
        DetailedLineitemslist=DetailedLineitemslist.concat(await  GetAllLineItems(ProcoreToken,tempArray))
    }
    const dateObject = new Date();
    DetailedLineitems.lastrefreshed=dateObject
    DetailedLineitems.DetailedLineitemslist=DetailedLineitemslist
    return DetailedLineitems
  }


  function GetAllLineItems(ProcoreToken,urls){   
    console.log(urls)
    return new Promise((resolve,rejects)=>{
        var promises = urls.map(url => fetch(url,{
            method:"GET",
            headers: ProcoreToken,
        }).then(res=> {
            if (res.status=res[Object.getOwnPropertySymbols(res)[1]].status==200){
                   
                return res.json()
            }else{
               throw Error
            }
        }).then(data=>{
            dataarray=[]
            data.forEach(elem=>{
                elem.invoicid=elem.holder.id
                dataarray.push(elem)
            })
            return dataarray 
        }))
        Promise.all(promises).then(results=>{
            resolve(results)
            }).catch(err=>{
                console.log("Error in getteing data"),
                console.log(err),
                rejects(err)
            });
    })
       
} 
    
    data = await GetLineItems(ProcoreToken,ApiURL,ProjectId,DirectCostList)
    
    return data
}catch(err){
    console.log("caught something ")
    throw Error
}

    // // var url = ApiURL+'/rest/v1.0/budget_views/436295/detail_rows?project_id='+ProjectId
    // url = ApiURL+'/rest/v1.0/projects/'+ ProjectId +'/direct_costs/'+DirectCostID+'/line_items'
    // // url = ApiURL+'/rest/v1.0/requisitions?project_id='+ProjectId


}








module.exports=DirectCostLineItem;

