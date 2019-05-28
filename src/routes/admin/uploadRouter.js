var express = require('express');

var Router = express.Router();

const ctrl = require('../../controllers/admin/uploadController.js');


// 上传封面图片
Router.post('/nc/admin/uploadimg',ctrl.uploadimg);

// 上传附件
Router.post('/nc/admin/uploadfile',ctrl.uploadfile);

 

module.exports = Router;