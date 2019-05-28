var config = require('../../config/config.js');
var commonProcess = require('../../common/commonProcess.js');
var resuleobj = require('../../config/resultobj.js');
var kits = require('../../common/kits.js');

exports.getMyCourseList = (req,res) =>{

    if(!req.session.admin_user){
        resuleobj.noLogin('登录失效，请重新登录');
        res.json(resuleobj.result); 
        return;
    }

    let sql = `SELECT 
    og.order_id,og.goods_id,og.goods_title,og.last_section,og.last_section_name,
    o.add_time AS begin_time,og.timeout_time AS end_time,
    og.complate_percent,og.update_time
    FROM dt_order_goods og 
    inner join dt_orders o on (og.order_id = o.id AND o.status = 1)
    WHERE og. user_id = ${req.session.admin_user.uid}`;

	console.log(sql)

    let warpObj = {
        currentCourse:{},
        CourseList:[]
    }

    commonProcess.execSqlCallBack(req,res,sql,(err,datas)=>{
        if(err){
            resuleobj.fail('我的课程获取失败:');
            res.json(resuleobj.result); 
            return;
        }

        if(!datas || datas.length <=0){
            resuleobj.success('您还没有购买过课程:');
            res.json(resuleobj.result); 
            return;
        }

        // 找出最大的update_time表示是最近学过的课程
        datas.forEach(item=>{
            item.update_timestamp = new Date(item.update_time).getTime();
        });

        // 课程数据按照最后更新时间倒序排列，排第一条的即为最近学习课程
       let newDatas = datas.sort((p,n)=>{
            return n.update_timestamp - p.update_timestamp; 
        });

        // 获取最近学习的课程
        warpObj.currentCourse = newDatas[0];

        // 所有课程赋值
        warpObj.CourseList = newDatas;
        // 返回
        resuleobj.success(warpObj);
        res.json(resuleobj.result);
    });
}


exports.getMyOrderListByPage = (req,res) =>{
    
    if(!req.session.admin_user){
        resuleobj.noLogin('登录失效，请重新登录');
        res.json(resuleobj.result); 
        return;
    }

    let warpObj = {
        // 获取订单类型数据
        OrderTypeList:[
            {id:-1,title:'全部订单'}
        ].concat(config.orderStatus),
        // 单页订单数据以及改订单下的商品数据
        orderList:[]
    };

    // 订单的状态code，来源于 OrderTypeList数组中的某个对象值
    let orderStatusCode = req.params.orderStatusCode;

    let where = '';
    if(parseInt(orderStatusCode) > -1){
        where += ` and status = ${orderStatusCode} `; 
    }

    let sqlCount = ` select count(1) as count from dt_orders where user_id = ${req.session.admin_user.uid} ${where} `;

    commonProcess.execQueryCount(req,res,sqlCount,(pageobj)=>{
        
        if(pageobj.totalCount<=0){
            resuleobj.success('没有符合条件的数据');
            res.json(resuleobj.result);
            return;
        }

        // 分页查询订单数据（没有订单所包含的课程数据）
        let sqlQueryOrders = ` SELECT id,order_no,add_time,payable_amount,real_amount,status
         FROM dt_orders where user_id = ${req.session.admin_user.uid} ${where}  order by id desc
         limit ${pageobj.skipCount},${pageobj.pageSize} ` ;

         commonProcess.execSqlCallBack(req,res,sqlQueryOrders,(err,orders)=>{
            if(err){
                resuleobj.fail('订单分页数据获取失败');
                res.json(resuleobj.result); 
                return;
            }


            // 查询当前分页订单数据对应的课程数据
            let orderIDS = orders.map(order=>order.id).join(',');
            if(pageobj.totalCount<=0){
                resuleobj.fail('orderIDS获取失败');
                res.json(resuleobj.result);
                return;
            }


let sqlQueryOrderGoods = `SELECT og.id,og.order_id,og.goods_id,og.goods_title,og.timeout_time,g.lesson_star,
                            CONCAT('${config.imgDomain}',og.img_url) AS img_url
                            FROM dt_order_goods og
                            left join dt_goods g on (og.goods_id = g.id)
                            WHERE order_id IN (${orderIDS})
                            ` ;

            commonProcess.execSqlCallBack(req,res,sqlQueryOrderGoods,(err1,ordergoodslist)=>{
                if(err1){
                    resuleobj.fail('订单对应课程数据获取失败');
                    res.json(resuleobj.result); 
                    return;
                }


            // 组装最终结果
            orders.forEach(order=>{
                // 在order对象中增加一个订单状态的文字显示和order.status配对
                let tempArr = config.orderStatus.filter(item=>item.id == order.status);
                if(tempArr && tempArr.length >0 ){
                     order.statusName = tempArr[0].title;
                }else{
                    order.statusName = '状态异常';
                }

                // 将订单课程数据作为order中的order_goods_list数组进行挂载
                order.order_goods_list = ordergoodslist.filter(item1=>item1.order_id == order.id);
            });

            warpObj.orderList = orders;

             // 返回
             resuleobj.successByPage(warpObj,pageobj.totalCount,pageobj.pageIndex,pageobj.pageSize);
             res.json(resuleobj.result);

            });

        });

    });

}

// 更新dt_order_goods表中的当前课程小节id和小节名称（在我的课程中显示每个课程学习的当前章节是什么）
// 和更新update_time (在我的课程中显示最近学习的课程)
// 同时计算出这一小节占整个章节的百分比（在我的课程中显示已学习完的百分比）
exports.updateGoodsSection =(req,res)=>{
    if(!req.session.admin_user){
        resuleobj.noLogin('登录失效，请重新登录');
        res.json(resuleobj.result); 
        return;
    }

    let goods_id = req.body.goods_id; //课程id
    let sid = req.body.section_id;  // 章节id
    let sname=req.body.section_name; //章节名称


    let sqlSection = 
    ` select count(1) as count from dt_goods_section where goods_id = ${goods_id}   
      UNION ALL
      select count(1) as count from dt_goods_section where goods_id = ${goods_id}  and id < ${sid}  
     `;

    
     let complate_percent = 0; // 当前章节代表的百分比
     commonProcess.execSqlCallBack(req,res,sqlSection,(err,datas)=>{
        if(err){
            resuleobj.fail('获取课程章节总数失败:'+err.message);
            res.json(resuleobj.result); 
            return;
        }

        if(!datas || datas.length<=0){
            resuleobj.fail('当前课程没有章节数据，请先添加');
            res.json(resuleobj.result); 
            return;
        }

        let totalCount = datas[0].count;  //当前课程章节总数量
        let lessCurrentSectionIDCount = datas[1].count; //小于当前章节id的当前课程章节总数量
        
        // console.log(lessCurrentSectionIDCount,totalCount);

        // 计算百分比值,保留2位小数
        complate_percent = (lessCurrentSectionIDCount / totalCount * 100).toFixed(0);


        let sql =`update dt_order_goods set last_section = ${sid} ,last_section_name = '${sname}',
        update_time = NOW(),complate_percent=${complate_percent} 
        where goods_id = ${goods_id} and user_id = ${req.session.admin_user.uid} `;
  console.log(sql);
        commonProcess.execSqlCallBack(req,res,sql,(err1,datas)=>{
            if(err1){
                resuleobj.fail('更新我的课程数据失败:'+err1.message);
                res.json(resuleobj.result); 
                return;
            }

              // 返回
                resuleobj.success('更新我的课程数据成功');
                res.json(resuleobj.result);

        });
    


    });


}