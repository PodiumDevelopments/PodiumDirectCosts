

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

require("dotenv").config();
const GetProcoreToken = require('./Modules/ProcoreAuth.js');
const GetDeficiencyItems = require('./Modules/GetDeficiencyItems')
// const auth = require('./Modules/IncomingAuth');
const auth = require('./Modules/IncomingBasicAuth');
fs = require('fs');
const Budget = require('./Modules/Budget')
const WorkOrderContractsDetails = require('./Modules/WorkOrderContractsDetails')
const CompanyVendors = require('./Modules/CompanyVendors')
var bodyParser = require('body-parser')
const BudgetSnapShots = require('./Modules/BudgetSnapShots')
const Invoices = require('./Modules/Invoices')
const InvoiceLineItems = require('./Modules/InvoiceLineItemsV2')
const WebhookHandler = require('./Modules/WebhookHandler')
const DirectCost = require('./Modules/DirectCost')
const POs = require('./Modules/POs')
const locations = require('./Modules/Locations')
const WOs = require('./Modules/WOs')
const WOsLineItems = require('./Modules/WOsLineItems')
const DirectCostInvoices = require('./Modules/DirectCostInvoices')
const POsLineItems = require('./Modules/POsLineItems')
const COs = require('./Modules/COs')
const BillingPeriods = require('./Modules/BillingPeriods')
const ChangeEvents = require('./Modules/ChangeEvents')
const DirectCostLineItem = require('./Modules/DirectCostLineItem')
const UpdateDirectCostLineItem = require('./Modules/UpdateDirectCostLineItem')
const UpdateInvoiceDetails = require('./Modules/UpdateInvoiceDetails')
const getPdfs = require('./Modules/InvoicesPDFs')
const TaxCodes = require('./Modules/TaxCodes');
const ProjectsList = require('./Modules/ProjectsList');
const CheckLimit = require('./Modules/CheckLimit');

//render desk root
const DefaultDataFolder = '/var/diskdata/RFPLoaderData';


app.use(express.json());
app.use(express.urlencoded({ extended: true }))


if (!fs.existsSync(DefaultDataFolder)){
    fs.mkdirSync(DefaultDataFolder);
}

if (!fs.existsSync('./Tokens')){
    fs.mkdirSync('./Tokens');
}
let ProcoreAuthUrl = "https://api.procore.com/oauth/token"
global.ApiURL="https://api.procore.com"
let ProcoreApiURL = "https://api.procore.com"
const CompanyID = process.env.COMPANY_ID

function limitcheck(req, res, next){
    try {
    projectID=req.query.projectid  

     if(req.method=='GET'){
        return next()
     }
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        CheckLimit(ProcoreToken, ProcoreApiURL, projectID).then(async data => {
            if (data.limit_remain>5 || req.method=='GET') {
                console.log(req.method)
                next();
              }else{
                res.status(429).json({
                    error: "Max Request Limit Reached:",
                    
                  })
              }
        })
    })  
      } catch {
        res.status(401).json({
          error: "something went wrong"
        });
      }
}


app.use('/Home', express.static('Public'));
var unless = function(path, middleware) {
    
    return function(req, res, next) {
        if (path === req.path) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};


app.post('/PDFS/',async (req,resp)=>{
    
    var time= Math.round(new Date().getTime()/1000)
    tempdir=`${DefaultDataFolder}/${time}`
    fs.mkdirSync(tempdir);
    const invoices= req.body
    try{
    await getPdfs(invoices,tempdir)
    }catch(err){
     console.log(err)
    }
    
    resp.status(200).download(`./tempinvoices.zip`,()=>{
        try{
     fs.unlinkSync('./tempinvoices.zip')
     fs.rmSync(tempdir, { recursive: true, force: true })
        }catch(err){
            console.log(err)
            resp.status(401).send("error")
        }
     ;
    })

 })
 app.get('/BillingPeriodslive/:project',  async (req, respo) => {
    ProjectID = req.params.project
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        BillingPeriods(ProcoreToken, ProcoreApiURL, ProjectID).then(async data => {
            respo.send(data) 
        })
    })
})
app.get('/BudgetSnapShots/:project',  async (req, respo) => {
    ProjectID = req.params.project
    
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        BudgetSnapShots(ProcoreToken, ProcoreApiURL, ProjectID).then(async data => {
            respo.send(data)
        })
    })
})
app.use(unless('/ProcoreHook',auth));

app.post('/login',(req,res)=>{
    res.status(200).send("Auth")
})
app.get('/TaxCodes/',async (req, respo) => {
    
    FilePath=DefaultDataFolder+'/'+ CompanyID
    FileName='TaxCodes.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})
app.post('/TaxCodes/',async (req, respo) => {
    ProjectID = req.params.project
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        TaxCodes(ProcoreToken, ProcoreApiURL, CompanyID).then(async data => {
            FilePath=DefaultDataFolder+'/'+ CompanyID
            FileName='TaxCodes.json'
            Data=FileSaver(FilePath,FileName,data)
            respo.send(Data)
        })
    })
})
app.use(unless('/checklimit',limitcheck))

app.get('/deflist/:project',(req, respo) => {
    
    ProjectID = req.params.project


    //procorewebhook
    //get data from Procore and Add to spreasheet
    try {
        GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
            GetDeficiencyItems(ProcoreToken, ProcoreApiURL, ProjectID).then(async data => {
                var Items = [];
                respo.send(data)

            })
        })
    } catch (e) {
        fs.writeFile('helloworld.txt', e, function (err) {
            if (err) return console.log(err);
            console.log('Hello World > helloworld.txt');
        });
    }

})
app.get('/customapp/1',(req, res) => {
    console.log(req)
    res.sendFile("./index.html", { root: __dirname })
})
app.post('/ProcoreHook/',async (req, res,next) => {
    Webhook={
    project_id:    req.body.project_id,
    resource_name: req.body.resource_name,
    resource_id:   req.body.resource_id,
    event_type:    req.body.event_type};
    console.log(Webhook)
    token = await GetProcoreToken(ProcoreAuthUrl)
    WebhookHandler(Webhook,token)
    .then(()=>{
        res.status(200).send(`Success`)})
    .catch(err=>{
        res.status(200).send("ERROR"+err)})
})

app.get('/ProjectsList/',async (req, respo) => {

    FilePath=DefaultDataFolder+'/'+ CompanyID
    FileName='ProjectsList.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})
app.post('/ProjectsList/',async (req, respo) => {
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        ProjectsList(ProcoreToken, ProcoreApiURL, CompanyID).then(async data => {
            FilePath=DefaultDataFolder+'/'+ CompanyID
            FileName='ProjectsList.json'
            Data=FileSaver(FilePath,FileName,data)
            respo.send(Data)
        })
    })
})
app.get('/CompanyVendors/',  async (req, respo) => {
    
    
    FilePath=DefaultDataFolder+'/'+ CompanyID
    FileName='CompanyVendors.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})
app.post('/CompanyVendors/',  async (req, respo) => {
    
    
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        CompanyVendors(ProcoreToken, ProcoreApiURL,CompanyID).then(async data => {
            
            NAMEIDFILTER=[]
            data.forEach(element => {
                NAMEIDFILTER.push({name:element.name,id:element.id})
            });
            FilePath=DefaultDataFolder+'/'+ CompanyID
            FileName='CompanyVendors.json'
            Data=FileSaver(FilePath,FileName,data)
            respo.send(Data)
        })
    })
})


// app.get('/budget/:project/:SnapshotID',  async (req, respo) => {
//     ProjectID = req.params.project
//     SnapshotID = req.params.SnapshotID
//     ProjectID = req.params.project
//     FilePath=DefaultDataFolder+'/'+ ProjectID
//     FileName=`budgetSS_${SnapshotID}.json`
//     Data=FileGetter(`${FilePath}/${FileName}`)
//     respo.send(Data)
// })
app.post('/budget/:project/:SnapshotID',  async (req, respo) => {
    ProjectID = req.params.project
    SnapshotID = req.params.SnapshotID
    
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        Budget(ProcoreToken, ProcoreApiURL, ProjectID, SnapshotID).then(async data => {
            FilePath=DefaultDataFolder+'/'+ ProjectID
            FileName=`budgetSS_${SnapshotID}.json`
            Data=FileSaver(FilePath,FileName,data)
            respo.send(Data)
        })
    })
})
app.post('/budget/current/:SnapshotID/:project',  async (req, respo) => {
    ProjectID = req.params.project
    SnapshotID = req.params.SnapshotID
    
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        Budget(ProcoreToken, ProcoreApiURL, ProjectID, SnapshotID).then(async data => {
            FilePath=DefaultDataFolder+'/'+ ProjectID
            FileName=`Current_Budget.json`
            Data=FileSaver(FilePath,FileName,data)
            respo.send(Data)
        })
        BudgetSnapShots(ProcoreToken, ProcoreApiURL, ProjectID).then(async data => {
            let SelectedBudget=[]
            data.forEach(elem=>{
                if (elem.id==SnapshotID){
                    SelectedBudget.push(elem)
                }
            FilePath=DefaultDataFolder+'/'+ ProjectID
            FileName=`Current_Budget_Info.json`
            Data=FileSaver(FilePath,FileName,SelectedBudget)
            })
        })
    })
})
app.get('/budget/SetCurrentBudget',  async (req, respo) => {
    ProjectID = req.params.project
    SnapshotID = req.params.SnapshotID
    
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        Budget(ProcoreToken, ProcoreApiURL, ProjectID, SnapshotID).then(async data => {
            FilePath=DefaultDataFolder+'/'+ ProjectID
            FileName=`Current_Budget.json`
            Data=FileSaver(FilePath,FileName,data)
            respo.send(Data)
        })
    })
})

app.post('/budget/previous/:SnapshotID/:project',  async (req, respo) => {
    ProjectID = req.params.project
    SnapshotID = req.params.SnapshotID
    
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        Budget(ProcoreToken, ProcoreApiURL, ProjectID, SnapshotID).then(async data => {
            FilePath=DefaultDataFolder+'/'+ ProjectID
            FileName=`Previous_Budget.json`
            Data=FileSaver(FilePath,FileName,data)
            respo.send(Data)
        })
        BudgetSnapShots(ProcoreToken, ProcoreApiURL, ProjectID).then(async data => {
            let SelectedBudget=[]
            data.forEach(elem=>{
                if (elem.id==SnapshotID){
                    SelectedBudget.push(elem)
                }
            FilePath=DefaultDataFolder+'/'+ ProjectID
            FileName=`Previous_Budget_Info.json`
            Data=FileSaver(FilePath,FileName,SelectedBudget)
            })
        })
    })
})
app.get('/budget/current/:project',  async (req, respo) => {
    
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='Current_Budget.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
    
})
app.get('/budget/currentInfo/:project',  async (req, respo) => {
    
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='Current_Budget_Info.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
    
})
app.get('/budget/previousInfo/:project',  async (req, respo) => {
    
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='Previous_Budget_Info.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
    
})
app.get('/budget/previous/:project',  async (req, respo) => {
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='Previous_Budget.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})

app.get('/Invoices/:project',  async (req, respo) => {
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='Invoices.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})
app.post('/Invoices/:project',  async (req, respo) => {
    ProjectID = req.params.project
    
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        Invoices(ProcoreToken, ProcoreApiURL, ProjectID).then(async data => {
            FilePath=DefaultDataFolder+'/'+ ProjectID
            FileName='Invoices.json'
            Data=FileSaver(FilePath,FileName,data)
            respo.send(Data)
        })
    })
})

app.get('/DirectCosts/:project',  async (req, respo) => {
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='DirectCosts.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})
app.post('/DirectCosts/:project',  async (req, respo) => {
    ProjectID = req.params.project
    
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        DirectCost(ProcoreToken, ProcoreApiURL, ProjectID).then(async data => {
            FilePath=DefaultDataFolder+'/'+ ProjectID
            FileName='DirectCosts.json'
            Data=FileSaver(FilePath,FileName,data)
            respo.send(Data)
        })
    })
})

app.get('/DirectCostsInvoices/:project',  async (req, respo) => {
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='DirectCostsInvoices.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})
app.post('/DirectCostsInvoices/:project',  async (req, respo) => {
    ProjectID = req.params.project
    
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        DirectCost(ProcoreToken, ProcoreApiURL, ProjectID).then(async data => {
                DirectCostInvoices(ProcoreToken, ProcoreApiURL,ProjectID,data).then(data=>{
                FilePath=DefaultDataFolder+'/'+ ProjectID
                FileName='DirectCostsInvoices.json'
                Data=FileSaver(FilePath,FileName,data)
                respo.send(Data)
            })
            
        })
    })
})

app.get('/WorkOrderContractsDetails/:project', async (req, respo) => {
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='WorkOrderContractsDetails.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})
app.post('/WorkOrderContractsDetails/:project', async (req, respo) => {
    ProjectID = req.params.project
   
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        WOs(ProcoreToken, ProcoreApiURL, ProjectID).then(async WorkOrders => {
            WorkOrderContractsDetails(ProcoreToken, ProcoreApiURL, ProjectID,WorkOrders).then(async data=>{
                FilePath=DefaultDataFolder+'/'+ ProjectID
                FileName='WorkOrderContractsDetails.json'
                Data=FileSaver(FilePath,FileName,data)
                respo.send(Data)
            })
            
        })
    })
})
// app.get('/InvoiceLineItems/:project',  async (req, respo) => {
//     ProjectID = req.params.project
    
//     JsonDataFileName = ProjectID + "_InvoicesDetails.json"
//     JsonDataFileName = './Data/' + JsonDataFileName

//     if (fs.existsSync(JsonDataFileName)) {
//         'Read local file and check last refreshed'
//         JsonData = fs.readFileSync(JsonDataFileName)
//         JsonData = JSON.parse(JsonData)
//         GetDatafromDate = JsonData.lastrefreshed

//         GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
//             'get all updated invoices since last refreshed dated'
//             Invoices(ProcoreToken, ProcoreApiURL, ProjectID, GetDatafromDate).then(async InvoiceList => {
                
//                 'delete and add line items from updated invoices'
//                 UpdateInvoiceDetails(ProcoreToken, ProcoreApiURL, ProjectID, InvoiceList).then(async data => {
//                     // console.log(data)
//                     respo.send(data)
//                 })

//             })
//         })
//     } else {
//         GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
//             Invoices(ProcoreToken, ProcoreApiURL, ProjectID).then(async InvoicesList => {
                
//                 InvoiceLineItems(ProcoreToken, ProcoreApiURL, ProjectID, InvoicesList).then(async data => {
//                     // let stream = fs.createReadStream(data);
//                     // stream = byline.createStream(stream);
//                     // stream.pipe(respo);
//                     // stream.on('end', respo.end);
//                     respo.send(data)
//                 })

//             })
//         })
//     }
// })

app.get('/InvoiceLineItems/:project',  async (req, respo) => {
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='InvoiceLineItems.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
    
})
app.post('/InvoiceLineItems/:project',  async (req, respo) => {
    ProjectID = req.params.project
        GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
            Invoices(ProcoreToken, ProcoreApiURL, ProjectID).then(async InvoicesList => {
                InvoiceLineItems(ProcoreToken, ProcoreApiURL, ProjectID, InvoicesList).then(async data => {
                    FilePath=DefaultDataFolder+'/'+ ProjectID
                    FileName='InvoiceLineItems.json'
                    Data=FileSaver(FilePath,FileName,data)
                    respo.status(200).send(Data.message)
                }).catch(err=>{respo.status(500).send(err)})

            })
        })
    
})


app.get('/DirectCostLineItems/:project',  async (req, respo) => {
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='DirectCostLineItems.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})
app.post('/DirectCostLineItems/:project',  async (req, respo) => {
    ProjectID = req.params.project
        GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
            DirectCost(ProcoreToken, ProcoreApiURL, ProjectID).then(async DirectCostsList => {   
                DirectCostLineItem(ProcoreToken, ProcoreApiURL, ProjectID, DirectCostsList).then(async data => {
                    FilePath=DefaultDataFolder+'/'+ ProjectID
                    FileName='DirectCostLineItems.json'
                    Data=FileSaver(FilePath,FileName,data)
                    respo.send(Data.message)
                })
            })
        })
})

//conversion started here
//delete this
app.get('/DirectCostLineItemsRefresh/:project',  async (req, respo) => {
    ProjectID = req.params.project

    //get last refresehd date from Json file
    
    try{
        GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
            DirectCost(ProcoreToken, ProcoreApiURL, ProjectID).then(async DirectCostsList => {
                DirectCostLineItem(ProcoreToken, ProcoreApiURL, ProjectID, DirectCostsList).then(async data => {
                    respo.send(data)
                })
            })
        })
    }catch(error) {
        console.log(error)
       }


    // GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
    //     DirectCost(ProcoreToken, ProcoreApiURL, ProjectID,GetDatafromDate).then(async DirectCostsList => { 
    //         console.log(DirectCostsList) 
    //         DirectCostLineItem(ProcoreToken,ProcoreApiURL,ProjectID,DirectCostsList).then(async data => {
    //             console.log(data)
    //             respo.send(data)      
    //         })

    //     })
    // })
})

app.get('/POs/:project',  async (req, respo) => {
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='POs.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})
app.post('/POs/:project',  async (req, respo) => {
    ProjectID = req.params.project
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        POs(ProcoreToken, ProcoreApiURL, ProjectID).then(async data => {
            FilePath=DefaultDataFolder+'/'+ ProjectID
            FileName='POs.json'
            Data=FileSaver(FilePath,FileName,data)
            respo.send(Data)
        })
    })
})
app.post('/WOs/:project',  async (req, respo) => {
    ProjectID = req.params.project
    
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        WOs(ProcoreToken, ProcoreApiURL, ProjectID).then(async data => { 
            FilePath=DefaultDataFolder+'/'+ ProjectID
            FileName='WOs.json'
            Data=FileSaver(FilePath,FileName,data)
            respo.send(Data)
        })
    })
})
app.get('/WOs/:project',  async (req, respo) => {
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='WOs.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})
app.get('/WOsLineItems/:project', async (req, respo) => {
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='WOsLineItems.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})
app.post('/WOsLineItems/:project', async (req, respo) => {
    ProjectID = req.params.project
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        WOs(ProcoreToken, ProcoreApiURL, ProjectID).then(async WorkOrders => { 
            WOsLineItems(ProcoreToken, ProcoreApiURL, ProjectID,WorkOrders).then(async data=>{
            FilePath=DefaultDataFolder+'/'+ ProjectID
            FileName='WOsLineItems.json'
            Data=FileSaver(FilePath,FileName,data)
            respo.send(Data)
            })
        })
    })
})

//conversion starts here
app.get('/POsLineItem/:project', async (req, respo) => {
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='POsLineItem.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})
app.post('/POsLineItem/:project', async (req, respo) => {
    ProjectID = req.params.project
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        POs(ProcoreToken, ProcoreApiURL, ProjectID).then(async WorkOrders => { 
            POsLineItems(ProcoreToken, ProcoreApiURL, ProjectID,WorkOrders).then(async data=>{
            FilePath=DefaultDataFolder+'/'+ ProjectID
            FileName='POsLineItem.json'
            Data=FileSaver(FilePath,FileName,data)
            respo.send(Data)
            })
        })
    })
})
app.get('/Locations/:project',  async (req, respo) => {
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='Locations.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})
app.post('/Locations/:project',  async (req, respo) => {
    ProjectID = req.params.project
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        locations(ProcoreToken, ProcoreApiURL, ProjectID).then(async data => {
            WOsLineItems(ProcoreToken, ProcoreApiURL, ProjectID,WorkOrders).then(async data=>{
                FilePath=DefaultDataFolder+'/'+ ProjectID
                FileName='Locations.json'
                Data=FileSaver(FilePath,FileName,data)
                respo.send(Data)
            })
        })
    })
})
app.get('/COs/:project',  async (req, respo) => {
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='COs.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})
app.post('/COs/:project',  async (req, respo) => {
    ProjectID = req.params.project
    
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        COs(ProcoreToken, ProcoreApiURL, ProjectID).then(async data => {
            FilePath=DefaultDataFolder+'/'+ ProjectID
            FileName='COs.json'
            Data=FileSaver(FilePath,FileName,data)
            respo.send(Data)        })
    })
})
app.get('/BillingPeriods/:project',  async (req, respo) => {
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='BillingPeriods.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})
app.post('/BillingPeriods/:project',  async (req, respo) => {
    ProjectID = req.params.project
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        BillingPeriods(ProcoreToken, ProcoreApiURL, ProjectID).then(async data => {
            FilePath=DefaultDataFolder+'/'+ ProjectID
            FileName='BillingPeriods.json'
            Data=FileSaver(FilePath,FileName,data)
            respo.send(Data)
            
        })
    })
})

app.post('/SetBillingPeriod/:BillingPeriod/:project',  async (req, respo) => {
    ProjectID = req.params.project
    BillingPeriod=req.params.BillingPeriod
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        BillingPeriods(ProcoreToken, ProcoreApiURL, ProjectID).then(async data => {
            FilePath=DefaultDataFolder+'/'+ ProjectID
            FileName='SetBillingPeriod.json'
            data.forEach(elem=>{
                if (elem.id==BillingPeriod){
                    Data=FileSaver(FilePath,FileName,elem)
                }
            })
            
            respo.send(Data)
            
        })
    })
})
app.get('/SetBillingPeriod/:project',  async (req, respo) => {
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='SetBillingPeriod.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})

app.get('/ChangeEvents/:project',  async (req, respo) => {
    ProjectID = req.params.project
    FilePath=DefaultDataFolder+'/'+ ProjectID
    FileName='ChangeEvents.json'
    Data=FileGetter(`${FilePath}/${FileName}`)
    respo.send(Data)
})
app.post('/ChangeEvents/:project',  async (req, respo) => {
    ProjectID = req.params.project
    
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        ChangeEvents(ProcoreToken, ProcoreApiURL, ProjectID).then(async data => {
            FilePath=DefaultDataFolder+'/'+ ProjectID
            FileName='ChangeEvents.json'
            Data=FileSaver(FilePath,FileName,data)
            respo.send(Data)
        })
    })
})

app.post('/InvoiceData/:project', async(req,resp)=>{
    projectID=req.params.project
    filepath=`${DefaultDataFolder}/`+projectID+'_InvoicesDetails.json'
    try{
    if(fs.existsSync(filepath)){
    fs.unlinkSync(filepath)
    }}catch(err){
        console.log(err)
    }
    resp.status(200).send("Direct costs Deleted")
})
app.post('/DirectCostData/:project', async(req,resp)=>{
    projectID=req.params.project
    let filepath=`${DefaultDataFolder}`+projectID+'_directcost.json'
    try{
    if(fs.existsSync(filepath)){
    fs.unlinkSync(filepath)
    }}catch(err){
        console.log(err)
    }
    resp.status(200).send("Direct costs Deleted")
})

app.post('/ResetInvoiceData', async(req,resp)=>{
    projectID=req.query.projectid
    
    filepath='./Data/'+projectID+'_InvoicesDetails.json'
    try{
    if(fs.existsSync(filepath)){
    fs.unlinkSync(filepath)
    }
    }catch(err){
        console.log(err)
    }
    try{
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        Invoices(ProcoreToken, ProcoreApiURL, projectID).then(async InvoicesList => {
           
            InvoiceLineItems(ProcoreToken, ProcoreApiURL, projectID, InvoicesList).then(async data => {
                
                resp.status(200).send("Invoice Data Reset is Complete")
            }).catch((err)=>{
                console.log(err)
                resp.send("Something went wrong")
            })

        }).catch((err)=>{
            console.log(err)
            resp.send("Something went wrong")
        })
    })}catch(err){
        resp.send("something went wrong")
    }

})

app.post('/ResetDirectCostData', async(req,resp)=>{
    projectID=req.query.projectid
    
    let filepath='./Data/'+projectID+'_directcost.json'
    try{
    if(fs.existsSync(filepath)){
    fs.unlinkSync(filepath)
    }}catch(err){
        console.log(err)
    }
    try{
        GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
            DirectCost(ProcoreToken, ProcoreApiURL, projectID).then(async DirectCostsList => {
                
                DirectCostLineItem(ProcoreToken, ProcoreApiURL, projectID, DirectCostsList).then(async data => {
                    
                    resp.status(200).send("Direct Cost Data Reset is Complete")
                }).catch(err=>{resp.send("Something went wrong")})

            }).catch(err=>{resp.send("Something went wrong")})
        })
    }catch(err){
        resp.send("Something went wrong")
    }
})

app.post('/checklimit', (req,res)=>{
    projectID=req.query.projectid  
    GetProcoreToken(ProcoreAuthUrl).then(async ProcoreToken => {
        CheckLimit(ProcoreToken, ProcoreApiURL, projectID).then(async data => {
            var Items = [];
            
            res.send(data)
        })
    })
    
})

app.get('/Home', (req,resp)=>{
    console.log(home)
})

app.post('/test/', async(req,resp)=>{
    console.log(req.query.projectid)
    await setTimeout(()=>{ 
        resp.status(200).send("Done")},3000)
   
    // projectID=req.params.project
    // filepath='./Data/'+projectID+'_InvoicesDetails.json'
    // try{
    // if(fs.existsSync(filepath)){
    // fs.unlinkSync(filepath)
    // }}catch(err){
    //     console.log(err)
    // }
    // resp.status(200).send("Direct costs Deleted")
})

function FileSaver(path,filename,data){
   
    try{
        fs.mkdir(path, { recursive: true }, (err) => {
            if (err) throw err;
          });
    fs.writeFileSync(path+'/'+filename,JSON.stringify(data),err=>{
        if(err){
            throw err
        } 
    })
    return {message:"Data is Loaded"}
    }catch(err){
        return {message:"Error in Data Reset"}
    }
    
   
}

function FileGetter(filepath){

    if (fs.existsSync(filepath)){
        Data=fs.readFileSync(filepath)
        Data=JSON.parse(Data)
        return Data
    }else{
        return {message:"No Data Found, Please Reset"}
    }
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

