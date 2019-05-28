var config = require('../../config/config.js');
var commonProcess = require('../../common/commonProcess.js');
var resuleobj = require('../../config/resultobj.js');
var kits = require('../../common/kits.js');

exports.getmyorderlistByPage = (req,res) =>{
    let orderStatus = req.query.orderstatus;

    let where = '';
    if(orderStatus != "-1"){
        where = ` and status= ${orderStatus} `;
    }

    let sqlCount = ` select count(1) as count from dt_orders
             where user_id = ${req.session.admin_user.uid} ${where} `;
    
        commonProcess.execQueryCount(req, res, sqlCount, (pageobj) => {
    
            let sql = ` SELECT id,
                        order_no,
                        user_id,
                        user_name,
                        payment_id,
                        case payment_id when 1 then '微信支付' when 2 then '支付宝支付'
                        end as payment_Name,
                        payable_amount,
                        real_amount,                        
                        status,
                        case status when 0 then '待付款' when 1 then '已完成' when 2 then '已取消'
                        end as status_Name,
                        add_time,
                        complete_time  FROM dt_orders 
                        where  user_id = ${req.session.admin_user.uid}  ${where} order by id desc
                        limit ${pageobj.skipCount},${pageobj.pageSize} `;
    
            commonProcess.execSqlCallBack(req, res, sql, (err, datas) => {
                if (err) {
                    resuleobj.fail('我的订单分页数据获取失败:' + err.message);
                    res.json(resuleobj.result);
                    return;
                }
    
                // 返回
                resuleobj.successByPage(datas, pageobj.totalCount, pageobj.pageIndex, pageobj.pageSize);
                res.json(resuleobj.result);
            });
    
        });
}

// 获取订单详情数据
exports.getorderInfoById = (req,res) =>{
    let orderid = req.params.id;
    let warpObj = {
        orderInfo:{},
        goodslist:[]
    }

    let sql = `SELECT o.id,o.order_no,o.user_id,o.user_name,o.payable_amount,
    o.add_time,o.complete_time,o.status,o.remark
     FROM dt_orders o
    WHERE o.id = ${orderid}`;

    commonProcess.execSqlCallBack(req, res, sql, (err, datas) => {
        if (err) {
            resuleobj.fail('获取订单详情异常:' + err.message);
            res.json(resuleobj.result);
            return;
        }

        if(!datas || datas.length<=0){
            resuleobj.fail('订单id传入非法');
            res.json(resuleobj.result);
            return;
        }

        warpObj.orderInfo = datas[0];

        let sqlGoodslist = ` select od.id,od.goods_title,concat('${config.imgDomain}',od.img_url) as img_url
        ,od.goods_sell_price,od.add_time as begin_time  
        ,adddate(od.add_time,interval g.timeout month) as eng_time
        from dt_order_goods od
        inner join dt_goods g on (od.goods_id = g.id)
        where order_id = ${orderid} `;
        
        commonProcess.execSqlCallBack(req, res, sqlGoodslist, (err1, datas1) => {
            if (err1) {
                resuleobj.fail('获取订单对应的商品数据异常:' + err1.message);
                res.json(resuleobj.result);
                return;
            }
        
            warpObj.goodslist = datas1;
            
            // 返回
            resuleobj.success(warpObj);
            res.json(resuleobj.result);

        });
    });

}