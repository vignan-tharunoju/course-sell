const { Router } = require("express");
const { adminModel, courseModel } = require("../database/index.js");
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken') ;
const adminRouter = Router();
const z = require("zod");
const dotenv = require("dotenv");
dotenv.config();

//add different jwt password for both user and admin
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD ;

adminRouter.post('/signup', async (req, res) => {
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
        await adminModel.create({
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

adminRouter.post('/signin', async (req, res) => {
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
        const admin = await adminModel.findOne({email}) ;

        if (!admin) {
            return res.status(401).json({message : "Invalid email or password"})
        }
        
        const passwordMatched = await bcrypt.compare(password, admin.password) ;

        if (!passwordMatched) {
            return res.status(401).json({message : "Invalid email or password"})
        }

        const token = jwt.sign({
            adminId : admin._id
        }, JWT_ADMIN_PASSWORD, { expiresIn: '24h' });
        
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

//this function should be in courseModel actually, resource course
adminRouter.delete('/delete', async (req, res) => {
    //to be checked against all possible cases after completing courseModel
    //zod validate => course id
    const schema = z.object({
        courseId : z.string() //to be added => check if it is of type objectId
    })

    //Can delete any course
    try {
        const record = await adminModel.deleteOne({
            courseId : req.body.courseId
        });
        res.json(record)
    }
    catch (err) {
        res.json({
            message : err.message
        })
    }
})

module.exports = adminRouter ;
