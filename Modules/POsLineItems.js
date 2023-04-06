const fetch = require('node-fetch');
const fs = require("fs");



const POsLineItems = async (ProcoreToken,ApiURL,ProjectId,PurchaseOrders)=>{

        return new Promise((resolve,rejects)=>{
                urls=[]
                for(var PurchaseOrder of PurchaseOrders){
                    urls.push(ApiURL+`/rest/v1.0/purchase_order_contracts/${PurchaseOrder.id}/line_item_contract_details?project_id=${ProjectId}`)
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


module.exports=POsLineItems;

