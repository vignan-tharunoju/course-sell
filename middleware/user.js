const dotenv = require("dotenv");
dotenv.config();

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD ;

function userMiddleware(req, res, next) {
    const token = req.headers.token ;
    const user = jwt.verify(token, JWT_USER_PASSWORD) ;

    if (user) {
        req.userId = user.userId ;
        next() ;
    }
    else return res.json(
        {message : "Invalid token"}
    ) ;
}

module.exports = userMiddleware ;