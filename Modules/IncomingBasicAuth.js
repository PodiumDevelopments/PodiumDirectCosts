require("dotenv").config();
AUTH_username = process.env.APIAUTH_Username
AUTH_PW = process.env.APIAUTH_Password

module.exports = (req, res, next) => {
  
  try {
    console.log("Request Reveived")
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [incominglogin, incomingpassword] = Buffer.from(b64auth, 'base64').toString().split(':')
   
    if (incominglogin == AUTH_username && incomingpassword == AUTH_PW) {
      next();
    } else {

      throw 'Invalid user ID';
    }
  } catch {
    res.status(401).json({
      error: "Invalid credentials"
    });
  }
};