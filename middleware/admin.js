const dotenv = require("dotenv");
dotenv.config();

const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD ;

function adminMiddleware(req, res, next) {
    const token = req.headers.token ;
    const admin = jwt.verify(token, JWT_ADMIN_PASSWORD) ;

    if (admin) {
        req.adminId = admin.adminId ;
        next() ;
    }
    else return res.json(
        {message : "Invalid token"}
    ) ;
}

module.exports = adminMiddleware ;