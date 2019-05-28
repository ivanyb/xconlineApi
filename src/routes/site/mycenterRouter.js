var express = require('express');

var Router = express.Router();

const ctrl = require('../../controllers/site/mycenterController.js');

// 获取我的课程列表
Router.get('/getMyCourseList',ctrl.getMyCourseList);

// 获取我的订单列表
Router.get('/getMyOrderListByPage/:orderStatusCode',ctrl.getMyOrderListByPage);

//  更新dt_order_goods表中的当前课程小节id和小节名称，同时计算出这一小节占整个章节的百分比
Router.post('/updateGoodsSection',ctrl.updateGoodsSection);


module.exports = Router;