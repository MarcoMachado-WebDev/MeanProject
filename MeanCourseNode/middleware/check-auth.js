const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const userData = jwt.verify(token, "secret_this_should_be_longer");
        req.userData = {email: decodedtoken.email, userId:decodedToken.useId};
        next();
    }catch(error){
        res.status(401).json({message: "Auth failled"})
    }
    
}