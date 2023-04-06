const fetch = require('node-fetch');
const fs = require("fs")


const DirectCost = async (ProcoreToken, ApiURL, ProjectId, GetDatafromDate) => {
    // url = ApiURL+'/rest/v1.0/projects/'+ ProjectId +'/direct_costs?filters[updated_at]=${yesteday}...${today}`'
    if (GetDatafromDate) {
        DateNow = new Date(Date.now());
        DateNow = DateNow.toISOString()
        url = ApiURL + '/rest/v1.0/projects/' + ProjectId + '/direct_costs?filters[updated_at]=' + GetDatafromDate + '...' + DateNow
    } else {
        url = ApiURL + '/rest/v1.0/projects/' + ProjectId + '/direct_costs'

    }

    // var url = ApiURL+'/rest/v1.0/budget_views/436295/detail_rows?project_id='+ProjectId

    // url = ApiURL+'/rest/v1.0/requisitions?project_id='+ProjectId

    try {


        var res = await fetch(url,
            {
                method: "GET",
                headers: ProcoreToken,
            })
    } catch (e) {
        console.log(e)

    }

    if (res.status = res[Object.getOwnPropertySymbols(res)[1]].status == 200) {
       
        let data = await res.json()
        return data
    } else {
       

        throw Error
    }

}


module.exports = DirectCost;

