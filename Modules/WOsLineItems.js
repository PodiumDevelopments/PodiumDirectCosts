const fetch = require('node-fetch');
const fs = require("fs");



const WOsLineItems = async (ProcoreToken,ApiURL,ProjectId,WorkOrders)=>{

        return new Promise((resolve,rejects)=>{
                urls=[]
                for(var WorkOrder of WorkOrders){
                    urls.push(ApiURL+`/rest/v1.0/work_order_contracts/${WorkOrder.id}/line_item_contract_details?project_id=${ProjectId}`)
                }
                var promises = urls.map(url => fetch(url,{
                    method:"GET",
                    headers: ProcoreToken,
                }).then(res=> res.json()))

                Promise.all(promises).then(results=>{
                    array=[]
                    results.forEach((element,index) => {
                        if (element.constructor.toString().indexOf("Array") > -1){
                            array.push(element)
                        }
                    });
                    resolve(array)
                    });
                })  
}


module.exports=WOsLineItems;

