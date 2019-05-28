var express = require('express');

var Router = express.Router();

const ctrl = require('../../controllers/admin/sectionController.js');

// 获取课程大纲列表数据
Router.get('/ch/admin/getsectionlist/:goods_id',ctrl.getsectionlist);

// 根据id获取课程大纲数据
Router.get('/ch/admin/getsectioninfoById/:id',ctrl.getsectioninfoById);

// 添加课程大纲数据
Router.post('/ch/admin/addsectioninfo',ctrl.addsectioninfo);

// 编辑课程大纲数据
Router.post('/ch/admin/editsectioninfo',ctrl.editsectioninfo);

// 根据id删除课程大纲数据
Router.get('/ch/admin/delsectioninfo/:ids',ctrl.delsectioninfo);

module.exports = Router;