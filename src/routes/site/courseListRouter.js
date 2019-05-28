var express = require('express');

var Router = express.Router();

const ctrl = require('../../controllers/site/courseListController.js');

// 获取课程列表页一级分类和其他分类
Router.get('/getCateList',ctrl.getCateList);

// 根据分类分页获取课程数据 
// /nc/course/courseList/getCourseList?cate_top_id=-1&cate_id=-1&type=-1&pageIndex=1&pageSize=10
Router.get('/getCourseList',ctrl.getCourseList);


module.exports = Router;