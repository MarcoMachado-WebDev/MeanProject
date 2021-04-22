const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const userData = jwt.verify(token, "secret_this_should_be_longer");
        console.log(userData);
        req.userData = {email: userData.email, userId:userData.userId};
        console.log(req.userData);

        next();
    }catch(error){
        res.status(401).json({message: "Auth failled"})
    }
    
}