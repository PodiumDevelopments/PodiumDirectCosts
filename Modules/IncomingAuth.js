require("dotenv").config();
AUTH_username = process.env.APIAUTH_Username
AUTH_PW = process.env.APIAUTH_Password

module.exports = (req, res, next) => {
  
  try {
    console.log("Request Reveived")
    const username = req.headers.username
    const password = req.headers.pw
    if (req.headers.username == AUTH_username && req.headers.pw == AUTH_PW) {
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