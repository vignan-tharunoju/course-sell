const dotenv = require("dotenv");
dotenv.config();

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD ;

function userMiddleware(req, res, next) {
    const token = req.headers.token ;
    const user = jwt.verify(token, JWT_USER_PASSWORD) ;

    if (user) {
        req.userId = user.id ;
        next() ;
    }
    else return res.json(
        {message : "You are not signed in"}
    ) ;
}

module.exports = {
    userMiddleware : userMiddleware
} ;