var express = require('express');

var Router = express.Router();

const ctrl = require('../../controllers/admin/orderController.js');

// 分页获取我的订单列表数据
Router.get('/ch/admin/getmyorderlistByPage',ctrl.getmyorderlistByPage);

// 获取订单详情数据
Router.get('/ch/admin/getorderInfoById/:id',ctrl.getorderInfoById);


module.exports = Router;