const dotenv = require("dotenv");
dotenv.config();

const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD ;

function adminMiddleware(req, res, next) {
    const token = req.headers.token ;
    const user = jwt.verify(token, JWT_ADMIN_PASSWORD) ;

    if (user) {
        req.userId = user.id ;
        next() ;
    }
    else return res.json(
        {message : "You are not signed in"}
    ) ;
}

module.exports = {
    adminMiddleware :adminMiddleware
} ;