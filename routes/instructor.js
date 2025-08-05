const { Router } = require("express");
const { instructorModel, courseModel } = require("../database/index.js");
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken') ;
const instructorRouter = Router();
const z = require("zod");
const dotenv = require("dotenv");
const instructorMiddleware = require("../middleware/instructor.js");
dotenv.config();

const JWT_INSTRUCTOR_PASSWORD = process.env.JWT_INSTRUCTOR_PASSWORD ;


instructorRouter.post('/signup', async (req, res) => {
    //zod schema validation 
    // to be added => strict password => atleast one numerical, extra char, uppercase, lowercase
    const schema = z.object({
        email : z.string().email().min(3).max(30),
        password : z.string().min(6).max(30),
        firstName : z.string(),
        lastName : z.string()
    })
    const parsed = schema.safeParse(req.body) ;

    //invalid schema
    if (!parsed.success) {
        const errorMessages = parsed.error.errors.map(err => ({
            message: err.message
        }));
        return res.status(404).json(errorMessages)
    }

    const {email, password, firstName, lastName} = req.body ;
    //valid schema, hash the password and create a record
    try {
        const hashedPassword = await bcrypt.hash(password, 5) ;
        await instructorModel.create({
            email, password : hashedPassword, firstName, lastName
        });
        res.json({message : 'You are signed up'});
    }
    catch(err) {
        res.status(404).json({
            message : err.message
        }) ;
    }
})

instructorRouter.post('/signin', async (req, res) => {
    const schema = z.object({
        email : z.string().email().min(3).max(30),
        password : z.string().min(6).max(30) 
    })
    const parsed = schema.safeParse(req.body) ;

    //invalid schema
    if (!parsed.success) {
        const errorMessages = parsed.error.errors.map(err => ({
            message: err.message
        }));
        return res.status(404).json(errorMessages)
    }

    //valid schema, check for correctness of password and return a token
    try {
        const {email, password} = req.body ;
        const instructor = await instructorModel.findOne({email}) ;

        if (!instructor) {
            return res.status(401).json({message : "Invalid email or password"})
        }
        
        const passwordMatched = await bcrypt.compare(password, instructor.password) ;

        if (!passwordMatched) {
            return res.status(401).json({message : "Invalid email or password"})
        }

        const token = jwt.sign({
            instructorId : instructor._id
        }, JWT_INSTRUCTOR_PASSWORD, { expiresIn: '24h' });
        
        res.json({
            token : token, 
            message : 'You are signed in'
        });
    }
    catch(err) {
        res.status(500).json({
            message : err.message
        }) ;
    }
})

instructorRouter.post('/course', instructorMiddleware, async (req, res) => {
    const instructorId = req.instructorId ;

    const {title, description, imageUrl, price} = req.body ;

    try {
        const course = await courseModel.create({
            title, description, imageUrl, price, instructorId
        })
        res.json({
            message : "Course created successfully",
            courseId : course._id
        });
    }catch(e) {
        res.status(500).json({message : "Internal error"}) ;
    }
    
})

instructorRouter.get('/courses', instructorMiddleware, async (req, res) => {
    const instructorId = req.instructorId ;

    try {
        const courses = await courseModel.find({
            instructorId
        })

        res.json({
            courses
        });
    }catch(e) {
        res.status(500).json({message : "Internal error"}) ;
    }
})


instructorRouter.delete('/course', async (req, res) => {
    res.json('deleted');
})

instructorRouter.put('/course', instructorMiddleware, async (req, res) => {
    const instructorId = req.instructorId ;

    const {courseId, title, description, imageUrl, price} = req.body ;

    try {
        const course = await courseModel.updateOne({
            _id : courseId,
            instructorId
        }, {
            title, description, imageUrl, price
        }) ;
        res.json({
            message : "Course created successfully",
            courseId : course._id
        });
    }
    catch (e) {
        res.json({message : "Internal error"}) ;
    }
})

module.exports = instructorRouter;