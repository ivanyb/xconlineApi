var express = require('express');

var Router = express.Router();

const ctrl = require('../../controllers/admin/courseController.js');

// 获取课程各种属性：热门，置顶，轮播，初级，中级，高级数据
Router.get('/nc/admin/getCourseTypes',ctrl.getCourseTypes);

// 分页获取课程数据
Router.get('/ch/admin/getCourseListByPager',ctrl.getCourseListByPager);

// 删除课程数据
Router.get('/ch/admin/deleteCourse/:ids',ctrl.deleteCourse);

// 根据课程id获取课程数据
Router.get('/ch/admin/getCourseInfoById/:id',ctrl.getCourseInfoById);

// 编辑课程数据
Router.post('/ch/admin/editCourseInfo',ctrl.editCourseInfo);

// 新增课程数据
Router.post('/ch/admin/addCourse',ctrl.addCourse);


module.exports = Router;