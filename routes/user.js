const { Router } = require("express");
const { userModel, courseModel } = require("../database/index.js");
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken') ;
const userRouter = Router();
const z = require("zod");
const dotenv = require("dotenv");
dotenv.config();

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD ;

userRouter.post('/signup', async (req, res) => {
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
        await userModel.create({
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

userRouter.post('/signin', async (req, res) => {
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
        const user = await userModel.findOne({email}) ;

        if (!user) {
            return res.status(401).json({message : "Invalid email or password"})
        }
        
        const passwordMatched = await bcrypt.compare(password, user.password) ;

        if (!passwordMatched) {
            return res.status(401).json({message : "Invalid email or password"})
        }

        const token = jwt.sign({
            id : user._id
        }, JWT_USER_PASSWORD, { expiresIn: '24h' });
        
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

userRouter.get('/purchases', async (req, res) => {
    const userId = req.userId ;

    const purchases = await purchaseModel.find({
        userId
    })

    const coursesData = await courseModel.find({
        _id: {$in : purchases.map(x => x.courseId)}
    })
    res.json({
        purchases
    })
})

module.exports = userRouter;