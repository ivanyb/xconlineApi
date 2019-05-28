
module.exports = function(app){
    
    // 课程 
    const courseRouter = require('./courseRouter.js'); 
    app.use('/',courseRouter);

    
    // 课程类别
    const cateRouter = require('./cateRouter.js'); 
    app.use('/',cateRouter);

    // 课程大纲
    const sectionRouter = require('./sectionRouter.js'); 
    app.use('/',sectionRouter);

    // 我的订单
    const orderRouter = require('./orderRouter.js'); 
    app.use('/',orderRouter);

    // 上传图片和附件
    const uploadRouter = require('./uploadRouter.js'); 
    app.use('/',uploadRouter);
}