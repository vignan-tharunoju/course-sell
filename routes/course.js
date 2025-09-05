const { Router } = require('express') ;
const { userMiddleware } = require('../middleware/user');
const { purchaseModel, courseModel } = require('../database');
const courseRouter = Router() ;

courseRouter.post('/purchase', userMiddleware, async (req, res) => {
    //zod => userId, courseId
    const userId = req.userId ;
    const courseId = req.body.courseId ; 

    //check - should that the user has actually paid the price
    await purchaseModel.create({
        userId,
        courseId
    })

    res.json({
        message : 'signup endpoint'}
    );
})

courseRouter.get('/preview', async (req, res) => {
    const courses = await courseModel.find({}) ;
    res.json({
        courses
    });
})

courseRouter.delete('/preview', (req, res) => {
    res.json({
        message : 'course preview endpoint'}
    );
})

module.exports = courseRouter ;