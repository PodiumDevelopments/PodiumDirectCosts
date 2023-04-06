
//get project ID from url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const ProjectId = urlParams.get('procoreProjectId')
const CompanyID= urlParams.get('procoreCompanyId')
//assign functions to buttons 

//
const loginblock=document.getElementById('loginContin')
const homeblock=document.getElementById('HomeContain')
loginblock.style.display='flex'
homeblock.style.display='none'
//btns assigments
const login_btn=document.getElementById("login_btn")
const Bud_btn= document.getElementById("Budget-btn")
const BillP_btn= document.getElementById("BillingP-btn")
const Comm_btn= document.getElementById("Commit-btn")
const Dir_btn = document.getElementById("Dircost-btn");
const Inv_btn = document.getElementById("CommitC-btn");
const chk_lmt = document.getElementById("chcklmt");


//texts assignments

const Bud_btn_span= document.getElementById("Budget-span")
const BillP_btn_span= document.getElementById("BillingP-span")
const Comm_btn_span= document.getElementById("Commit-span")
const Dir_btn_span = document.getElementById("Dircost-span");
const Inv_btn_span = document.getElementById("CommitC-span");
const chk_lmt_span = document.getElementById("chcklmt-span");

const biiling_period_list=document.getElementById("BillingP-list")
const current_budget_list=document.getElementById("CurrentB")
const prev_budget_list=document.getElementById("PrevB")
const Url= window.location.origin
// add event listener for the button, for action "click"
login_btn.addEventListener("click", login);
Inv_btn.addEventListener("click", LoadInvData);
Dir_btn.addEventListener("click", LoadDirectInvData);
Bud_btn.addEventListener("click", LoadBudget);
BillP_btn.addEventListener("click", LoadBillingPeriods);
Comm_btn.addEventListener("click", LoadCommitmets);
chk_lmt.addEventListener("click", limitcheck);



chk_lmt.addEventListener("click",limitcheck)

//get Billing Periods


function login(){
    username = document.getElementById("Username").value
    pw = document.getElementById("Password").value
    var myHeaders = new Headers();
    myHeaders.set('Authorization', 'Basic ' + window.btoa(username + ":" + pw));
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(Url+'/login',requestOptions).then(res=>{
        if (res.status==200){
            loginblock.style.display='none'
            homeblock.style.display='flex'
            GetBillingPeriods()
            GetBudgetSnapshots()
        }else{
            window.alert("Invalid Credentials");
        }
    })
}

async function GetBillingPeriods(){
  data= await GetfromServer('BillingPeriodslive')
    data.data.forEach(element => {
        console.log(element)
       const {id, position, start_date,end_date} = element
       text= `${position} : ${start_date} - ${end_date}`
       entry=document.createElement('option')
       entry.id=id
       entry.appendChild(document.createTextNode(text));
       biiling_period_list.appendChild(entry)
    });
}
async function GetBudgetSnapshots(){
    data= await GetfromServer('BudgetSnapShots')
    console.log(data)
    data.data.forEach(element => {
        if(element.budget_view.id==436295){
        var documentFragment = document.createDocumentFragment();
        const {id, name} = element
        text= `${name}`
        entry=document.createElement('option')
        entry.id=id
        entry2=document.createElement('option')
        entry2.id=id
        entry.appendChild(document.createTextNode(text));
        entry2.appendChild(document.createTextNode(text));
        prev_budget_list.appendChild(entry)

        current_budget_list.appendChild(entry2)}
       
     });
  }
function LoadCompanyinfo(){
    ComapnyServerReset('CompanyVendors')
    ComapnyServerReset('ProjectsList')
    ComapnyServerReset('TaxCodes')
}

async function LoadBudget(){
    selected_PrevB=prev_budget_list.options[prev_budget_list.selectedIndex].id
    selected_CurrentB=current_budget_list.options[current_budget_list.selectedIndex].id
    Bud_btn.style.visibility="hidden"
    Bud_btn_span.innerHTML=""
    var entry = document.createElement('li');
    entry.classList.add('fa', 'fa-spinner', 'fa-spin')
    Bud_btn_span.appendChild(entry)
    responses=[]
    responses.push( await ServerReset(`budget/previous/${selected_PrevB}`))
    responses.push( await ServerReset(`budget/current/${selected_CurrentB}`))
    
    let hasFailed =false
    responses.forEach(res=>{
        if (res.code!="200"){
            hasFailed =true
        }
    })
    if(hasFailed){
        Bud_btn_span.innerHTML="Load Failed. Check Limit"
    }else{
        Bud_btn_span.innerHTML="Loaded!"
    }
    LoadCompanyinfo()

    Bud_btn.style.visibility="visible"
}

async function LoadBillingPeriods(){
    selected_BillingP=biiling_period_list.options[biiling_period_list.selectedIndex].id
    BillP_btn.style.visibility="hidden"
    BillP_btn_span.innerHTML=""
    var entry = document.createElement('li');
    entry.classList.add('fa', 'fa-spinner', 'fa-spin')
    BillP_btn_span.appendChild(entry)
    responses=[]
    responses.push(await ServerReset('BillingPeriods'))
    responses.push(await ServerReset(`SetBillingPeriod/${selected_BillingP}`))
    
    let hasFailed =false
    responses.forEach(res=>{
        if (res.code!="200"){
            hasFailed =true
        }
    })
    if(hasFailed){
        BillP_btn_span.innerHTML="Load Failed. Check Limit/Credentials"
    }else{
        BillP_btn_span.innerHTML="Loaded!"
    }
    BillP_btn.style.visibility="visible"
}

async function LoadCommitmets(){
    Comm_btn.style.visibility="hidden"
    Comm_btn_span.innerHTML=""
    var entry = document.createElement('li');
    entry.classList.add('fa', 'fa-spinner', 'fa-spin')
    Comm_btn_span.appendChild(entry)
    responses=[]
    responses.push( await ServerReset('WorkOrderContractsDetails'))
    let hasFailed =false
    responses.forEach(res=>{
        if (res.code!="200"){
            hasFailed =true
        }
    })
    if(hasFailed){
        Comm_btn_span.innerHTML="Load Failed. Check Limit/Credentials"
    }else{
        Comm_btn_span.innerHTML="Loaded!"
    }
    Comm_btn.style.visibility="visible"

}
async function LoadDirectInvData() {
    Dir_btn.style.visibility="hidden"
    Dir_btn_span.innerHTML=""
    var entry = document.createElement('li');
    entry.classList.add('fa', 'fa-spinner', 'fa-spin')
    Dir_btn_span.appendChild(entry)
    responses=[]
    responses.push( await ServerReset('DirectCosts'))
    responses.push( await ServerReset('DirectCostLineItems'))
    responses.push(  await ServerReset('DirectCostsInvoices'))
    let hasFailed =false
    responses.forEach(res=>{
        if (res.code!="200"){
            hasFailed =true
        }
    })
    if(hasFailed){
        Dir_btn_span.innerHTML="Load Failed. Check Limit/Credentials"
    }else{
        Dir_btn_span.innerHTML="Loaded!"
    }
    Dir_btn.style.visibility="visible"
}



async function LoadInvData() {
    Inv_btn.style.visibility="hidden"
    Inv_btn_span.innerHTML=""
    var entry = document.createElement('li');
    entry.classList.add('fa', 'fa-spinner', 'fa-spin')
    Inv_btn_span.appendChild(entry)
    responses=[]
    responses.push(await ServerReset('InvoiceLineItems'))
    responses.push(await ServerReset('WOs'))
    responses.push(await ServerReset('WOsLineItems'))
    responses.push(await ServerReset('POs'))
    responses.push(await ServerReset('Invoices'))
    responses.push(await ServerReset('ChangeEvents'))
    responses.push(await ServerReset('POsLineItem'))
    responses.push(await ServerReset('COs'))
    let hasFailed =false
    responses.forEach(res=>{
        if (res.code!="200"){
            hasFailed =true
        }
    })
    if(hasFailed){
        Inv_btn_span.innerHTML="Load Failed. Check Limit/Credentials"
    }else{
        Inv_btn_span.innerHTML="Loaded!"
    }
   
    Inv_btn.style.visibility="visible"
}


async function ServerReset(endpoint){
    let requestOptions=getrequestOptions()
    return fetch(`${Url}/${endpoint}/${ProjectId}`, requestOptions)
        .then(async response => {
           return {data:await response.text(),code:response.status}
        })
        .catch(error => {return {data:error,code:400}});
}
async function ComapnyServerReset(endpoint){
    let requestOptions=getrequestOptions()
    return fetch(`${Url}/${endpoint}`, requestOptions)
        .then(async response => {
            return {data:await response.text(),code:response.status}
        })
        .catch(error => {return {data:error,code:400}});
}
async function GetfromServer(endpoint){
    let requestOptions=getrequestOptions()
    requestOptions.method='GET'
return fetch(`${Url}/${endpoint}/${ProjectId}`, requestOptions)
        .then( async response => {
             return {data:await response.json(),code:response.status}
        }).then(data=>{
            return data
        })
        .catch(error => {
            consle.log(error)
            return {data:error,code:400}});
}

function getrequestOptions(){
    let requestOptions
    username = document.getElementById("Username").value
    pw = document.getElementById("Password").value
    var myHeaders = new Headers();
    myHeaders.set('Authorization', 'Basic ' + window.btoa(username + ":" + pw));

    return requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

}
function limitcheck() {
    username = document.getElementById("Username").value
    pw = document.getElementById("Password").value
    var myHeaders = new Headers();
    myHeaders.set('Authorization', 'Basic ' + window.btoa(username + ":" + pw));
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };
//
    fetch(Url+"/checklimit?projectid="+ProjectId, requestOptions)
        .then(response => {
        
            
            return response.json()
        }).then(data=>{

       
            var myDate = new Date( data.limit_reset *1000);
            console.log(data)
            ResetPercent=Math.floor(data.limit_remain/data.limit*100)
            TimeuntilReset=(data.limit_reset *1000)-Date.now()
            TimeuntilReset=Math.ceil(TimeuntilReset/1000/60)
        
            

            return `${ResetPercent}% of hourly data load limit remaining.<br>${TimeuntilReset} min to limit reset. `
        })
        .then(result => document.getElementById('chcklmt-span').innerHTML=result)
        .catch(error => {console.log(error) 
            document.getElementById('chcklmt-span').innerHTML="Something went wrong, contact admin"});
}