const { Router } = require('express') ;
const courseRouter = Router() ;

courseRouter.post('/purchase', (req, res) => {
    //zod => userId, courseId
    //insert into userId, courseID
    res.json({
        message : 'signup endpoint'}
    );
})

courseRouter.get('/preview', (req, res) => {
    res.json({
        message : 'course preview endpoint'}
    );
})

courseRouter.delete('/preview', (req, res) => {
    res.json({
        message : 'course preview endpoint'}
    );
})

module.exports = courseRouter ;