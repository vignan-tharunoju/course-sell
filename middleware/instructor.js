const dotenv = require("dotenv");
dotenv.config();

const JWT_INSTRUCTOR_PASSWORD = process.env.JWT_INSTRUCTOR_PASSWORD ;

// function middleware(password) {
//     return function instructorMiddleware(req, res, next) {
//             const token = req.headers.token ;
//             const instructor = jwt.verify(token, JWT_INSTRUCTOR_PASSWORD) ;

//             if (instructor) {
//                 req.instructorId = instructor.instructorId ;
//                 next() ;
//             }
//             else return res.json(
//                 {message : "Invalid token"}
//             ) ;
//         }
// }

function instructorMiddleware(req, res, next) {
    const token = req.headers.token ;
    const instructor = jwt.verify(token, JWT_INSTRUCTOR_PASSWORD) ;

    if (instructor) {
        req.instructorId = instructor.instructorId ;
        next() ;
    }
    else return res.json(
        {message : "Invalid token"}
    ) ;
}

module.exports = instructorMiddleware ;