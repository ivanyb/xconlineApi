var config = require('../../config/config.js');
var commonProcess = require('../../common/commonProcess.js');
var resuleobj = require('../../config/resultobj.js');
var kits = require('../../common/kits.js');
var request = require('request');

// 加入购物车(需登录)
exports.postshopcar = (req,res) =>{

  let goods_id = req.query.gid || req.body.goods_id;

if(!req.session.admin_user){
    resuleobj.noLogin('登录失效，请重新登录');
    res.json(resuleobj.result); 
    return;
}


// 检查当前用户是否有添加了当前课程
 // let checkSql = ` select goods_id from dt_shop_car 
 // where goods_id = ${goods_id} and user_id = ${req.session.admin_user.uid} `;
    let checkSql = ` select goods_id from dt_shop_car 
  where user_id = ${req.session.admin_user.uid} `;


  let sql = ` INSERT INTO dt_shop_car(goods_id,user_id) VALUES
                (
                    ${goods_id},
                    ${req.session.admin_user.uid}
                ); ` ;
// console.log(sql);
   commonProcess.execSqlCallBack(req,res,checkSql,(err,datas)=>{
    if(err){
        resuleobj.fail('购物车商品重复检查sql执行异常');
        res.json(resuleobj.result); 
        return;
    }

    // 判断课程是否在购物车中已经存在
    //if(datas.length >0){
		if(datas.length > 0 && datas.filter(item=>item.goods_id == goods_id).length >0) {
        resuleobj.fail('该商品已经存在于购物车，无需重复添加');
        res.json(resuleobj.result);
        return;
    }

console.log(sql)
    commonProcess.execSqlCallBack(req,res,sql,(err1,datas1)=>{
        if(err1){
            resuleobj.fail('商品加入购物车失败');
            res.json(resuleobj.result); 
            return;
        }

        // 返回
        resuleobj.success({'text':'商品已加入购物车',count:(datas.length+1)});
        res.json(resuleobj.result);
    });

   });
    
}

// 用户购物车列表数据获取(需登录)
exports.getshopcarlist = (req,res) =>{

    if(!req.session.admin_user){
        resuleobj.noLogin('登录失效，请重新登录');
        res.json(resuleobj.result); 
        return;
    }
  

    let sql = `select sc.id as shop_car_id,g.id as goods_id,g.title,g.timeout,g.sell_price 
                ,CONCAT('${config.imgDomain}',g.img_url) as img_url
                FROM dt_goods g 
                INNER JOIN  dt_shop_car sc ON sc.goods_id = g.id 
                and sc.user_id = ${req.session.admin_user.uid}
                 ` ;

    
        commonProcess.execSqlCallBack(req,res,sql,(err,datas)=>{
        if(err){
            resuleobj.fail('购物车数据获取失败:');
            res.json(resuleobj.result); 
            return;
        }

        // 返回
        resuleobj.success(datas);
        res.json(resuleobj.result);
    });
}


// 删除购物车商品
exports.deleteshopcar = (req,res) =>{
    if(!req.session.admin_user){
        resuleobj.noLogin('登录失效，请重新登录');
        res.json(resuleobj.result); 
        return;
    }

    let sql = ` delete from  dt_shop_car
     where id =${req.params.goods_id} and user_id = ${req.session.admin_user.uid}`;
   console.log(sql);
     commonProcess.execSqlCallBack(req,res,sql,(err,datas)=>{
        if(err){
            resuleobj.fail('购物车商品数据删除失败');
            res.json(resuleobj.result); 
            return;
        }

        // 返回
        resuleobj.success('商品数据删除成功');
        res.json(resuleobj.result);
    });
}

// 下单操作(需登录)
exports.postOrder = (req,res) =>{
    /*
    if(!req.session.admin_user){
        resuleobj.noLogin('登录失效，请重新登录');
        res.json(resuleobj.result); 
        return;
    }
    */
    
    let amount = req.body.amount;
    let payment_id = req.body.payment_id; //支付方式 1:微信支付 2：支付宝支付 ，在config.paymentList管理
    let goodsIds = req.body.goodsIds; //订单所包含的商品id字符串 格式：1,2,3
 
    let order_no = kits.createOrderNO();

     // 根据goodsIds查询出课程数据和该课程第一章节      
    //  let queryGoodsSql = ` select MIN(s.id) AS sectionID,MIN(s.section_name) AS section_name,g.* from dt_goods g
    //  LEFT JOIN dt_goods_section s ON (s.goods_id = g.id AND s.parent_id=0)
    //    where g.id in (${goodsIds}) `;


    let queryGoodsSql = `
            SELECT temp.* FROM (
                select s.id AS sectionID,s.section_name AS section_name,g.* from dt_goods g
                    LEFT JOIN dt_goods_section s ON (s.goods_id = g.id AND s.parent_id=0)
                    where g.id in (${goodsIds})
            ) AS temp 
            WHERE (SELECT COUNT(1) FROM (
                select s.id AS sectionID,s.section_name AS section_name,g.* from dt_goods g
                    LEFT JOIN dt_goods_section s ON (s.goods_id = g.id AND s.parent_id=0)
                    where g.id in (${goodsIds})
                ) AS temp1 WHERE temp.id = temp1.id AND temp1.sectionID < temp.sectionID
                ) < 1
    `

    //    console.log(queryGoodsSql);

 commonProcess.execSqlCallBack(req,res,queryGoodsSql,(err1,datas1) => {  
        if(err1){
            resuleobj.fail('查询订单中包含的商品数据失败');           
            res.json(resuleobj.result); 
            return;
        }
        
        let order_remark = ''
        datas1.forEach(goodsitem=>{
            order_remark+= `${goodsitem.title}   原价：￥${goodsitem.sell_price} <br /> `;
        });

        let sql = ` INSERT INTO dt_orders
        (
        order_no
        ,user_id
        ,user_name
        ,payment_id
        ,payable_amount
        ,real_amount
        ,point
        ,status
        ,add_time
        ,complete_time
        ,remark
        )
        VALUES
        (               
        '${order_no}'
        ,${req.session.admin_user.uid}
        ,'${req.session.admin_user.uname}'
        ,${payment_id}
        ,${amount}
        ,0  /*该值等支付成功后修改成实际支付金额*/
        ,0  /*状态值在config.statusList中管理 0：未支付*/
        ,0
        ,NOW()
        ,NULL
        ,'${order_remark}'
        ); `;

        // console.log(sql)
       
        commonProcess.execSqlCallBack(req,res,sql,(err,datas) => {      
            if(err){
                resuleobj.fail('订单数据写入失败');
                res.json(resuleobj.result); 
                return;
            }

             // 获取订单表自增主键id值
            let order_id = datas.insertId;

            let flag = true;
            
            for(let i=0;i<datas1.length;i++){
                let goods = datas1[i];
                               
                // 拼接插入表dt_order_goods 数据的sql语句       
                /*
                update_time:每次观看这个课程的任何视频都要更新，表示最近学习的课程
                timeout_time：表示这个课程的到期时间，超过这个时间就表示结束了
                */  
                let insertshopcargoodsSql = `INSERT INTO dt_order_goods
                (
                 order_id
                ,goods_id
                ,goods_title
                ,img_url
                ,goods_sell_price
                ,goods_market_price
                ,quantity
                ,point
                ,user_id
                ,user_name
                ,add_time
                ,last_section
                ,last_section_name
                ,update_time 
                ,timeout_time
                )
                VALUES
                (
                ${order_id}
                ,${goods.id} 
                ,'${goods.title}'
                ,'${goods.img_url}' 
                ,${goods.market_price}
                ,${goods.sell_price}
                ,1
                ,0
                ,${req.session.admin_user.uid}
                ,'${req.session.admin_user.uname}'
                ,NOW()
                ,${goods.sectionID}
                ,'${goods.section_name}' 
                ,NOW()
                ,adddate(NOW(),interval ${goods.timeout} month)
                );` ;
                
                commonProcess.execSqlCallBack(req,res,insertshopcargoodsSql,(err2,datas2) => {
                    if(err2){                        
                        // 删除已经插入的订单数据
                        let delOrderSql = ` delete from dt_orders where id = ${order_id}`;                  
                        req.db.driver.execQuery(delOrderSql,(errdel,datadel)=>{});
                                                
                        resuleobj.fail('订单所包含课程数据插入失败');
                        try{
                        res.json(resuleobj.result); 
                        }catch(e){}
                        
                        return;
                    }
                    
                    // console.log(111);
                    if(i == datas1.length -1){
                        // 返回
                        let reswappObj = {
                            order_id:order_id,
                            order_no:order_no,
                            amount:amount,
                            remark:order_remark                    
                        }
                        
                        resuleobj.success(reswappObj);
                        res.json(resuleobj.result);
                    }
                });
            }
            
            // if(insertshopcargoodsSql.length <=0){
            //     resuleobj.fail('订单所包含课程数据插入sql语句不能为空');
            //     res.json(resuleobj.result); 
            //     return;
            // }

        });
     
    });
}
// 微信支付appid partner商户id ，partnerkey：秘钥 
// 支付帮助文档：https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=6_1
config.appid = 'wx8397f8696b538317'    
config.partner='1473426802'    
config.partnerkey =  "T6m9iK73b0kn9g5v426MKfHQH7X8rKwb";    
config.notify_url='http://wxapi.gz.itcast.cn/WeChatPay/WeChatPayNotify'

// 请求微信服务器，获取支付连接返回后再客户端生成二维码(需登录)
exports.wxpay = (req,res) =>{
	try{
    let order_id = req.body.order_id;
    let amount = req.body.amount;
    var out_trade_no = req.body.out_trade_no;    

    /* 传递参数给微信服务器，返回支付url地址给我们生成二维码，并扫码支付 */ 
    var nonce_str = randomString();
    var body = "next.js学成在线微信支付";
    var total_fee = 1;
    var spbill_create_ip = "127.0.0.1";
    var trade_type ='NATIVE';
    
    // 准备参数
    var order={
    appid: config.appid,
    body,
    mch_id:config.partner,
    nonce_str,
    notify_url:config.notify_url,
    out_trade_no,
    spbill_create_ip,
    total_fee,
    trade_type
    }
    // 签名验证
    var sign = paysignapi(order).toUpperCase();

    //准备xml数据
    var xml = `<xml>
    <appid>${order.appid}</appid>
    <body>${order.body}</body>
    <mch_id>${order.mch_id}</mch_id>
    <nonce_str>${order.nonce_str}</nonce_str>
    <notify_url>${order.notify_url}</notify_url>
    <out_trade_no>${order.out_trade_no}</out_trade_no>
    <spbill_create_ip>${order.spbill_create_ip}</spbill_create_ip>
    <total_fee>${order.total_fee}</total_fee>
    <trade_type>${order.trade_type}</trade_type>
    <sign>${sign}</sign>
    </xml>
    `
    console.log(xml);
    //发送请求跟微信服务器的交互
        request({url:"https://api.mch.weixin.qq.com/pay/unifiedorder",method:"POST",body:xml},(error,response,content)=>{
        if(error){
            console.log('发送请求跟微信服务器的交互异常：')
            console.log(error)
            resuleobj.fail(error.message);
            res.json(resuleobj.result);
            return;
        }    
        if(!error && response.statusCode==200){
                    console.log(content);
                    var code_url = getxmlnodevalue("code_url",content.toString("utf-8"));
                    var prepay_id =  getxmlnodevalue("prepay_id",content.toString("utf-8"));
                    var ret = {
                        appid:order.appid,
                        nonceStr:nonce_str,
                        package:'preapy_id='+prepay_id,
                        signType:'MD5'
                    }
                    var signjs = paysignapi(ret);
                    // {order_id,prepay_id,signjs,code_url,out_trade_no:order.out_trade_no,nonce_str}
                    resuleobj.success({order_id,code_url,out_trade_no:order.out_trade_no,nonce_str});
                    res.json(resuleobj.result);                
            }
        })
	}catch(e){
		console.log(e)
	}

}

// 确认支付状态(可以在客户端轮询)
exports.checkpay = (req,res)=>{
    var url = `https://api.mch.weixin.qq.com/pay/orderquery`
    var order_id = req.body.order_id;
    var nonce_str = req.body.nonce_str;
    var out_trade_no = req.body.out_trade_no;
    var ret = {
      appid: config.appid,
      mch_id: config.partner,
      nonce_str,
      out_trade_no
    }
  
  
    var sign = paysignapi(ret).toUpperCase();
    var xml = `<xml>
    <appid>${config.appid}</appid>
    <mch_id>${config.partner}</mch_id>
    <nonce_str>${nonce_str}</nonce_str>
    <sign>${sign}</sign>
    <out_trade_no>${out_trade_no}</out_trade_no>
    </xml>`
    request({ url: url, method: "POST", body: xml }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
         var result = {};
         result.trade_state = getxmlnodevalue('trade_state', body.toString("utf-8"));
         if(result.trade_state=="SUCCESS"){
            result.statusTxt="支付完成";       
            
            let updatesql = ` update dt_orders set status = 1 where id=${order_id} `;
            commonProcess.execSqlCallBack(req,res,updatesql,(err1,datas1) => {  
                if(err1){
                    resuleobj.fail('更新支付状态失败'+err1.message);           
                    res.json(resuleobj.result); 
                    return;
                }
            })
            
         }else{
            result.statusTxt = getxmlnodevalue('trade_state_desc',body.toString("utf-8"));
         }

         resuleobj.success(result);
         res.json(resuleobj.result);
      }
    })
}



function getxmlnodevalue(node_name,xml){
    var tmp = xml.split("<" + node_name + ">");
    var _tmp = tmp[1].split("</" + node_name + ">");
    var _tmp1 = _tmp[0].split('[');
    var res = _tmp1[2].split(']');
    return res[0];  
  }
  
  
  //微信支付验证算法
  function paysignapi(ret) {
    var string = raw(ret);
    var key = config.partnerkey;
    string = string + '&key=' + key;
    var crypto = require('crypto');
    return crypto.createHash('md5').update(string, 'utf8').digest('hex');
  };
  //对象排序
  function raw(args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
      newArgs[key] = args[key];
    });
    var string = '';
    for (var k in newArgs) {
      string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
  };

//随机生成字符串
function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var string = '';
    for (i = 0; i < len; i++) {
      string += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return string;
  }