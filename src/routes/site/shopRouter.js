var express = require('express');

var Router = express.Router();

const ctrl = require('../../controllers/site/shopController.js');

// 加入购物车(需登录)
Router.all('/ch/shop/postshopcar',ctrl.postshopcar);

// 用户购物车列表数据获取(需登录)
Router.get('/ch/shop/getshopcarlist',ctrl.getshopcarlist);

// 购物车数据删除(需登录)
Router.get('/ch/shop/deleteshopcar/:goods_id',ctrl.deleteshopcar);

// 下单操作(需登录)
Router.post('/ch/shop/postOrder',ctrl.postOrder);

// 微信支付连接获取（要生成二维码图片呈现给用户扫描）
Router.post('/ch/shop/wxpay',ctrl.wxpay)

// 微信支付
Router.post('/ch/shop/checkpay',ctrl.checkpay)

module.exports = Router;