var express = require('express');

var Router = express.Router();

const ctrl = require('../../controllers/admin/cateController.js');

// 获取课程分类列表数据
Router.get('/ch/admin/getcatelist',ctrl.getcatelist);

// 根据id获取课程分类数据
Router.get('/ch/admin/getcateinfoById/:id',ctrl.getcateinfoById);

// 添加课程分类数据
Router.post('/ch/admin/addcateinfo',ctrl.addcateinfo);

// 编辑课程分类数据
Router.post('/ch/admin/editcateinfo',ctrl.editcateinfo);

// 根据id删除课程分类数据
Router.get('/ch/admin/delcateinfo/:ids',ctrl.delcateinfo);

module.exports = Router;