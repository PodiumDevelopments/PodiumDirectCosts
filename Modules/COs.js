const fetch = require('node-fetch');
const fs = require("fs");
const { hasUncaughtExceptionCaptureCallback } = require('process');
const { rejects } = require('assert');


const COs = async (ProcoreToken,ApiURL,ProjectId)=>{
    url = ApiURL+'/rest/v1.0/change_order_packages?project_id='+ProjectId
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
    changeorderslineitems= await GetALLChangeOrderLineItems(ProcoreToken,ProjectId,data)
    // ChangeOrderLineItemsDetais = await GetALLChangeOrderLineItemsDetais(ProcoreToken,ProjectId,changeorderslineitems)
    // async function GetChangeOrderLineItems(ProcoreToken,ProjectId,data){
    //     changeorderslineitems=[]
    //     for(var ChangeOrder of data){
    //         changeorderlineitem= await GetFromProcore(ProcoreToken,ProjectId,ChangeOrder.id)    
    //         console.log(changeorderlineitem)
    //         changeorderslineitems.push(changeorderlineitem)
    //     ;
    //     }
    //     return  changeorderslineitems
    // }

    async function GetALLChangeOrderLineItems(ProcoreToken,ProjectId,data){
        return new Promise((resolve,rejects)=>{
        urls=[]
        for(var changeorder of data){
            urls.push(ApiURL+'/rest/v1.0/change_order_packages/'+changeorder.id+'?project_id='+ProjectId)
        }
        var promises = urls.map(url => fetch(url,{
            method:"GET",
            headers: ProcoreToken,
        }).then(res=> res.json()))

        Promise.all(promises).then(results=>{
            resolve(results)
            });
        })
    }
    
    async function GetALLChangeOrderLineItemsDetais(ProcoreToken,ProjectId,LineItems){
        return new Promise((resolve,rejects)=>{
            
            urls=[]
            for(var lineitem of LineItems){
               for(var i of lineitem){
                
                urls.push(ApiURL+'/rest/v1.0/potential_change_orders/'+i.holder.id+'/line_items/'+i.id+'?project_id='+ProjectId)
            }}
            
            var promises = urls.map(url => fetch(url,{
                method:"GET",
                headers: ProcoreToken,
            }).then(res=> res.json()))
    
            Promise.all(promises).then(results=>{
                console.log(results)
                resolve(results)
                });
                
                
    
                
            })  
    }

    // async function GetFromProcore(ProcoreToken,ProjectId,elementID){
    //     url = ApiURL+'/rest/v1.0/potential_change_orders/'+elementID+'/line_items?project_id='+ProjectId
    //         try{
    //             var res = await fetch(url,
    //                 {
    //                     method:"GET",
    //                     headers: ProcoreToken,
    //                 })
    //             }catch(e){
    //                 console.log(e)   
    //             }
    //             changeorderlineitem= await res.json()
    //             return changeorderlineitem
    // }
   
    return changeorderslineitems    
}


module.exports=COs;

