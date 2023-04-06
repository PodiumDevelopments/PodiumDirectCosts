const FormData = require('form-data');
const fs = require("fs")
const fetch = require('node-fetch');

CLIENT_SECRET= process.env.CLIENT_SECRET
CLIENT_ID= process.env.CLIENT_ID
company_id=process.env.COMPANY_ID




const GetProcoreToken = async (authurl) => {
    var tokenobj = {
        token: {},
        expired: true
    };
    tokenobj = await getlocaltoken(tokenobj)

    if (tokenobj.expired === false) {
        
        access_token=formattoken(tokenobj)
     
        return access_token
    } else { //get a new token
        try {
            
            const formdata = new FormData();
            
            formdata.append("grant_type", "client_credentials");
            
            formdata.append("client_id", CLIENT_ID);
         
            formdata.append("client_secret",CLIENT_SECRET);
            
            let res = await fetch(authurl, {
                method: 'POST',
                body: formdata,
            })
            
            if (res[Object.getOwnPropertySymbols(res)[1]].status==200){
            
            let data = await res.json()
            
            tokenobj.token = data;
            fs.writeFile('./Tokens/ProcoreToken.json', JSON.stringify(data), (err) => {
                // throws an error, you could also catch it here
                if (err) {
                    throw err;}

                // success case, the file was saved

            });
            
            access_token= formattoken(tokenobj)
           
            return  access_token}
            else{
                throw Error("Server is down")
           }
        } catch (e) {
            fs.writeFile('error.txt', e, function (err) {
                if (err) return console.log(err);
              
              });
        }
        
    }
}




const getlocaltoken = async (tokenobj) => {
    
    if (fs.existsSync('./Tokens/ProcoreToken.json')){
    data = fs.readFileSync('./Tokens/ProcoreToken.json')
    try{
    token = JSON.parse(data);}catch(err){return tokenobj}
    expiry = token.expires_in + token.created_at;
    if (expiry > Date.now() / 1000) {
        tokenobj.token = token;

        tokenobj.expired = false;
    }
}  

    return tokenobj

}

function formattoken(token) {
    return {
        Authorization: "Bearer " + token.token.access_token
    }
}

module.exports=GetProcoreToken
