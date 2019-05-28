var express = require('express');

var Router = express.Router();

const ctrl = require('../../controllers/site/homeController.js');

// 获取课程首页顶部分类数据和轮播图片数据
Router.get('/gettopdata',ctrl.gettopdata);

// 获取课程首页精品推荐数据
Router.get('/getTopCourseList',ctrl.getTopCourseList);

// 获取课程首页学科课程数据
Router.get('/getcourselist',ctrl.getCourselist);

// 用户点击热门，初级，中级，高级获取相应的课程数据
Router.get('/getcourselistByType/:cate_top_id/:type_id',ctrl.getcourselistByType);

module.exports = Router;