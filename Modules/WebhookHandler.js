
invoicsedb= require('./InvoicesDB')
directcostdb=require('./DirectCostDB')
function webhookhandler(Webhook,token){
    switch(Webhook.resource_name){
        case "Draw Requests":
            return InvoicesWebhook(Webhook);
        case "Direct Costs":
            return DirectCostInvoiceWebhook(Webhook);
        case "Direct Cost Line Items":
            return DirectCostLineItemWebhook(Webhook,token)
        default:
            return Promise.reject({error:"Can't hadnle this webhook"})
    }}


function InvoicesWebhook(Webhook){
    try{
    switch(Webhook.event_type){
        case "update":
            return invoicsedb.UpdateInvoice(Webhook.project_id,Webhook.resource_id);
        case"delete":
            return invoicsedb.DeleteInvoice(Webhook.project_id,Webhook.resource_id);
        default:
            return Promise.reject({error:"Can't hadnle this trigger"})

    }
}catch(err){console.log(err)}
}
function DirectCostInvoiceWebhook(Webhook){
    try{
    switch(Webhook.event_type){
        case "update":
            return directcostdb.UpdateInvoice(Webhook.project_id,Webhook.resource_id,token);
        case"delete":
            return directcostdb.DeleteInvoice(Webhook.project_id,Webhook.resource_id);
        default:
            return Promise.reject({error:"Can't hadnle this trigger"})
    }
}catch(err){console.log(err)}
}
function DirectCostLineItemWebhook(Webhook){
    try{
    switch(Webhook.event_type){
        //whenever there is an event, removel all line items for invoice and add again
        case "update":
            return directcostdb.UpdateLineitemInvoice(Webhook.project_id,Webhook.resource_id,token);
        case"delete":
            return directcostdb.UpdateLineitemInvoice(Webhook.project_id,Webhook.resource_id,token);
        case"create":
            return directcostdb.CreateLineitemInvoice(Webhook.project_id,Webhook.resource_id,token);
        default:
            return Promise.reject({error:"Can't hadnle this trigger"})

    }
}catch(err){console.log(err)}
}


module.exports=webhookhandler