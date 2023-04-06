const fetch = require('node-fetch');
const fs = require("fs");

const DirectCostLineItem = async (ProcoreToken, ApiURL, ProjectId, DirectCostsInvoices) => {

    
    DetailedLineitems = [];

    async function GetLineItems(ProcoreToken, ApiURL, ProjectId, DirectCostsInvoices) {
        DetailedLineitemslist = []
        DetailedLineitems = {}
        for (var item of DirectCostsInvoices) {

            LineItems = await asyncFunction(ProcoreToken, ApiURL, ProjectId, item)
           
            DetailedLineitemslist.push(LineItems)
        }




        return DetailedLineitemslist
    }


    async function asyncFunction(ProcoreToken, ApiURL, ProjectId, item) {
        try {

            url = ApiURL + '/rest/v1.0/projects/' + ProjectId + '/direct_costs/' + item.id + '/line_items'

            var res = await fetch(url,
                {
                    method: "GET",
                    headers: ProcoreToken,
                })
        } catch (e) {
            console.log(e)
        }
        let data = await res.json()
        directcostdata = []
        data.forEach(elem => {
            elem.invoicid = item.id
            directcostdata.push(elem)
        })
        // directcostdata.lineitems=data
        // directcostdata.directcostinfo=item
        return data
    }

   
    DirectCostsInvoicesLineItems = await GetLineItems(ProcoreToken, ApiURL, ProjectId, DirectCostsInvoices)
    
    JsonDataFileName = ProjectID + "_directcost.json"
    JsonDataFileName = './Data/' + JsonDataFileName
    JsonData = fs.readFileSync(JsonDataFileName)
    JsonData = JSON.parse(JsonData)
    OriginalData = JsonData.DetailedLineitemslist


    DirectCostsInvoices.forEach(Invoice => {
       

        // MatchedData=OriginalData.findIndex((x) =>x[0].invoicid==Invoice.id)
        OriginalData.forEach((elem, index) => {
            if (elem[0].invoicid == Invoice.id) {
                
                OriginalData.splice(index, 1)
            }
        })

        
        // console.log(MatchedData)
    })

    DirectCostsInvoicesLineItems.forEach(list => {
        JsonData.DetailedLineitemslist.push(list)
    })

    const dateObject = new Date();
    JsonData.lastrefreshed = dateObject
    filename = './Data/' + ProjectId + '_directcost.json'

    fs.writeFileSync(filename, JSON.stringify(JsonData), err => {
        if (err) {
            console.log(err)
        }
    })
    return JsonData
    // // var url = ApiURL+'/rest/v1.0/budget_views/436295/detail_rows?project_id='+ProjectId
    // url = ApiURL+'/rest/v1.0/projects/'+ ProjectId +'/direct_costs/'+DirectCostID+'/line_items'
    // // url = ApiURL+'/rest/v1.0/requisitions?project_id='+ProjectId


}

module.exports = DirectCostLineItem;

