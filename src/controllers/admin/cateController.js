var config = require('../../config/config.js');
var commonProcess = require('../../common/commonProcess.js');
var resuleobj = require('../../config/resultobj.js');
var kits = require('../../common/kits.js');

// 获取课程分类数据
exports.getcatelist = (req,res) =>{

    let sql = ` select * from dt_article_category where channel_id = 2 order by sort_id`;

    commonProcess.execSqlCallBack(req, res, sql, (err, datas) => {
        if (err) {
            resuleobj.fail('获取课程分类数据失败:' + err.message);
            res.json(resuleobj.result);
            return;
        }

        // 返回
        resuleobj.success(datas);
        res.json(resuleobj.result);
    });
}

// 根据id获取课程分类数据
exports.getcateinfoById = (req,res) =>{
        
    let id = req.params.id;        
    let sql = ` select * from dt_article_category where id= ${id} `;

    commonProcess.execSqlCallBack(req, res, sql, (err, datas) => {
        if (err) {
            resuleobj.fail('根据id获取课程分类数据失败:' + err.message);
            res.json(resuleobj.result);
            return;
        }

        // 返回
        resuleobj.success(datas);
        res.json(resuleobj.result);
    });

}
  
// 新增分类
exports.addcateinfo = (req,res)=>{
    
    let title = req.body.title;
    let parent_id = req.body.parent_id;
    let sort_id = req.body.sort_id;
    let img1_url = req.body.img1_url;
    let img_url = req.body.img_url;

       
    let insertSql = `INSERT INTO dt_article_category
                    (
                    channel_id
                    ,title
                    ,parent_id
                    ,class_list
                    ,class_layer
                    ,sort_id
                    ,img1_url
                    ,img_url
                    ,content                    
                    )
                    VALUES
                    (
                    2
                    ,'${title}'
                    ,${parent_id}
                    ,'' /* 插入后统一做更新处理 class_list */
                    ,0  /* 插入后统一做更新处理 class_layer */
                    ,${sort_id}
                    ,'${img1_url}' 
                    ,'${img_url}'
                    ,'' /* content*/
                    ); `;

    commonProcess.execSqlCallBack(req, res, insertSql, (err, datas) => {
        if (err) {
            resuleobj.fail('分类数据保存失败:' + err.message);
            res.json(resuleobj.result);
            return;
        }

        // 插入当前分类数据自动生成的id
        let insertId = datas.insertId;

        let selectParentSql = ` select class_list from dt_article_category where id = ${parent_id} `;
        
            commonProcess.execSqlCallBack(req, res, selectParentSql, (err1, datas1) => {
                if (err1) {
                    resuleobj.fail('获取父分类数据异常');
                    res.json(resuleobj.result);
                    return;
                }

                // 拼接当前分类的class_list字符串
                let class_list = ``;
                let class_layer = 1; //顶级菜单 层级为1

                // 二级分类数据
                if(datas1 && datas1.length >0){
                    class_list = `${datas1[0].class_list}${insertId},`;
                    //其他菜单 层级计算出来
                    class_layer = class_list.split(',').length - 2;

                }else{
                    // 顶级分类数据
                    class_list = `,${insertId},`;
                    class_layer = 1;//顶级菜单 层级为1
                }

                // 更新数据class_list和class_layer
                let updateSql = `update dt_article_category set class_list = '${class_list}',
                class_layer=${class_layer} where id = ${insertId} `;

                commonProcess.execSqlCallBack(req, res, updateSql, (err2, datas2) => {
                    if (err2) {
                        resuleobj.fail('更新分类数据class_list和class_layer异常：'+err2.message);
                        res.json(resuleobj.result);
                        return;
                    }

                    // 返回
                    resuleobj.success('分类数据保存成功');
                    res.json(resuleobj.result);
                });

            });
        
    });

}

// 编辑分类

exports.editcateinfo = (req,res)=>{
    
    let id = req.body.id;
    let title = req.body.title;
    let parent_id = req.body.parent_id;
    let sort_id = req.body.sort_id;
    let img1_url = req.body.img1_url;
    let img_url = req.body.img_url;

    // 获取父菜单数据
    let selectParentSql = ` select class_list from dt_article_category where id = ${parent_id} `;

    commonProcess.execSqlCallBack(req, res, selectParentSql, (err, datas) => {
        if (err) {
            resuleobj.fail('父分类数据获取异常' + err.message);
            res.json(resuleobj.result);
            return;
        }

         // 拼接当前分类的class_list字符串
         let class_list = ``;
         let class_layer = 1; //顶级菜单 层级为1

         // 二级分类数据
         if(datas && datas.length >0){
             class_list = `${datas[0].class_list}${id},`;
             //其他菜单 层级计算出来
             class_layer = class_list.split(',').length - 2;

         }else{
             // 顶级分类数据
             class_list = `,${id},`;
             class_layer = 1;//顶级菜单 层级为1
         }

        //  更新当前分类数据
        let updateSql = ` UPDATE dt_article_category 
                        SET                        
                        title = '${title}' 
                        ,parent_id = ${parent_id}
                        ,class_list = '${class_list}'
                        ,class_layer = ${class_layer}
                        ,sort_id = ${sort_id}
                        ,img1_url = '${img1_url}'
                        ,img_url = '${img_url}'
                        WHERE
                        id = ${id}
                        ;`;

        commonProcess.execSqlCallBack(req, res, updateSql, (err1, datas1) => {
            if (err1) {
                resuleobj.fail('分类数据修改异常' + err1.message);
                res.json(resuleobj.result);
                return;
            }

            // 返回
            resuleobj.success('分类数据修改成功');
            res.json(resuleobj.result);
        });
    });
       
}

// 物理删除分类数据
exports.delcateinfo =(req,res)=>{
    // 获取要删除的分类id字符串，格式：1,2,3
    let ids = req.params.ids;

    let sql = `select c1.id from (
        select c.* from dt_article_category c
          where  c.id in (${ids})
          ) temp
        inner join dt_article_category c1
          on (POSITION(concat(concat(',',temp.id),',') IN c1.class_list) )`;

    commonProcess.execSqlCallBack(req, res, sql, (err, datas) => {
        if (err) {
            resuleobj.fail('分类子数据获取异常' + err.message);
            res.json(resuleobj.result);
            return;
        }
    
        let allCateIds = datas.map(item=>item.id).join(',');
        // console.log(allCateIds)
        // 查找要删除的id中是否已经关联了课程数据,如果关联了不允许删除
        let selectSql = `select concat(g.category_id,c.title) as id_title from dt_goods g 
        inner join dt_article_category c on (g.category_id = c.id) where g.category_id in (${allCateIds}) `;

        // console.log(selectSql)
        commonProcess.execSqlCallBack(req, res, selectSql, (err1, datas1) => {
            if (err1) {
                resuleobj.fail('分类id是否关联课程检查异常' + err1.message);
                res.json(resuleobj.result);
                return;
            }

            if(datas1 && datas1.length >0){
                resuleobj.fail(`以下分类:(${datas1.map(item=>item.id_title).join(',')} )已经关联了课程，不允许删除`);
                res.json(resuleobj.result);
                return;
            }

              // 实现删除操作
            let delSql = ` delete from dt_article_category where id in (${allCateIds})`;
            
            commonProcess.execSqlCallBack(req, res, delSql, (err2, datas2) => {
                if (err2) {
                    resuleobj.fail('分类数据删除异常' + err2.message);
                    res.json(resuleobj.result);
                    return;
                }

            // 返回
            resuleobj.success('分类数据删除成功');
            res.json(resuleobj.result);
            });
        });

        
    });
  
}