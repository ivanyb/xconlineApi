var config = require('../../config/config.js');
var commonProcess = require('../../common/commonProcess.js');
var resuleobj = require('../../config/resultobj.js');
var kits = require('../../common/kits.js');

// 获取课程大纲数据
exports.getsectionlist = (req,res) =>{
    let goods_id = req.params.goods_id;

    let sql = ` SELECT  id,
                goods_id,
                parent_id,
                section_sortid,
                section_name,
                is_free,
                CONCAT('${config.imgDomain}',video_path) AS video_path,
                video_time,
                CONCAT('${config.imgDomain}',code_path) AS code_path, 
                CONCAT('${config.imgDomain}',notes_path) AS notes_path,  
                add_time,
                class_list,
                class_layer FROM dt_goods_section where goods_id = ${goods_id} order by section_sortid  `;

    commonProcess.execSqlCallBack(req, res, sql, (err, datas) => {
        if (err) {
            resuleobj.fail('获取课程大纲数据失败:' + err.message);
            res.json(resuleobj.result);
            return;
        }
        

        // 返回
        resuleobj.success(datas);
        res.json(resuleobj.result);
    });
}

// 根据id获取课程大纲数据
exports.getsectioninfoById = (req,res) =>{
        
    let id = req.params.id;        
    let sql = ` select id,
                        goods_id,
                        parent_id,
                        section_sortid,
                        section_name,
                        is_free,
                        CONCAT('${config.imgDomain}',video_path) AS video_path,
                        video_time,
                        CONCAT('${config.imgDomain}',code_path) AS code_path, 
                        CONCAT('${config.imgDomain}',notes_path) AS notes_path,  
                        add_time,
                        class_list,
                        class_layer from dt_goods_section where id= ${id} `;

    commonProcess.execSqlCallBack(req, res, sql, (err, datas) => {
        if (err) {
            resuleobj.fail('根据id获取课程大纲数据失败:' + err.message);
            res.json(resuleobj.result);
            return;
        }

        // 返回
        resuleobj.success(datas);
        res.json(resuleobj.result);
    });

}
  
// 新增大纲
exports.addsectioninfo = (req,res)=>{
    
    let goods_id = req.body.goods_id;
    let section_name = req.body.section_name;
    let parent_id = req.body.parent_id;
    let section_sortid = req.body.section_sortid;
    let is_free = req.body.is_free;
    let video_path = req.body.video_path;
    let video_time = req.body.video_time;
    let code_path = req.body.code_path;
    let notes_path = req.body.notes_path;

       
    let insertSql = `INSERT INTO dt_goods_section
                        (
                            goods_id
                            ,parent_id
                            ,section_sortid
                            ,section_name
                            ,is_free
                            ,video_path
                            ,video_time
                            ,code_path
                            ,notes_path
                            ,add_time
                            ,class_list
                            ,class_layer
                        )
                        VALUES
                        (
                            ${goods_id}
                            ,${parent_id}
                            ,${section_sortid}
                            ,'${section_name}'
                            ,${is_free} 
                            ,'${video_path}' 
                            ,${video_time}
                            ,'${code_path}'
                            ,'${notes_path}' 
                            ,NOW()
                            ,''
                            ,0
                        );`;

    commonProcess.execSqlCallBack(req, res, insertSql, (err, datas) => {
        if (err) {
            resuleobj.fail('大纲数据保存失败:' + err.message);
            res.json(resuleobj.result);
            return;
        }

        // 插入当前大纲数据自动生成的id
        let insertId = datas.insertId;

        let selectParentSql = ` select class_list from dt_goods_section where id = ${parent_id} `;
        
            commonProcess.execSqlCallBack(req, res, selectParentSql, (err1, datas1) => {
                if (err1) {
                    resuleobj.fail('获取父大纲数据异常');
                    res.json(resuleobj.result);
                    return;
                }

                // 拼接当前大纲的class_list字符串
                let class_list = ``;
                let class_layer = 1; //顶级大纲 层级为1

                // 二级大纲数据
                if(datas1 && datas1.length >0){
                    class_list = `${datas1[0].class_list}${insertId},`;
                    //其他菜单 层级计算出来
                    class_layer = class_list.split(',').length - 2;

                }else{
                    // 顶级大纲数据
                    class_list = `,${insertId},`;
                    class_layer = 1;//顶级大纲 层级为1
                }

                // 更新数据class_list和class_layer
                let updateSql = `update dt_goods_section set class_list = '${class_list}',
                class_layer=${class_layer} where id = ${insertId} `;

                commonProcess.execSqlCallBack(req, res, updateSql, (err2, datas2) => {
                    if (err2) {
                        resuleobj.fail('更新大纲数据class_list和class_layer异常：'+err2.message);
                        res.json(resuleobj.result);
                        return;
                    }

                    // 返回
                    resuleobj.success('大纲数据保存成功');
                    res.json(resuleobj.result);
                });

            });
        
    });

}

// 编辑大纲

exports.editsectioninfo = (req,res)=>{
    
    let id = req.body.id;  
    let section_name = req.body.section_name;
    let parent_id = req.body.parent_id;
    let section_sortid = req.body.section_sortid;
    let is_free = req.body.is_free;
    let video_path = req.body.video_path;
    let video_time = req.body.video_time;
    let code_path = req.body.code_path;
    let notes_path = req.body.notes_path;

    // 获取父大纲数据
    let selectParentSql = ` select class_list from dt_goods_section where id = ${parent_id} `;

    commonProcess.execSqlCallBack(req, res, selectParentSql, (err, datas) => {
        if (err) {
            resuleobj.fail('父大纲数据获取异常' + err.message);
            res.json(resuleobj.result);
            return;
        }

         // 拼接当前大纲的class_list字符串
         let class_list = ``;
         let class_layer = 1; //顶级菜单 层级为1

         // 二级大纲数据
         if(datas && datas.length >0){
             class_list = `${datas[0].class_list}${id},`;
             //其他菜单 层级计算出来
             class_layer = class_list.split(',').length - 2;

         }else{
             // 顶级大纲数据
             class_list = `,${id},`;
             class_layer = 1;//顶级菜单 层级为1
         }

        //  更新当前大纲数据
        let updateSql = ` UPDATE dt_goods_section 
                        SET                            
                            parent_id = ${parent_id}
                            ,section_sortid = ${section_sortid}
                            ,section_name = '${section_name}'
                            ,is_free = ${is_free} 
                            ,video_path = '${video_path}'
                            ,video_time = ${video_time}
                            ,code_path = '${code_path}'
                            ,notes_path = '${notes_path}'         
                            ,class_list = '${class_list}' 
                            ,class_layer = '${class_layer}'
                        WHERE
                        id = ${id}
                        `;
        //  console.log(updateSql);
        commonProcess.execSqlCallBack(req, res, updateSql, (err1, datas1) => {
            if (err1) {
                resuleobj.fail('大纲数据修改异常' + err1.message);
                res.json(resuleobj.result);
                return;
            }

            // 返回
            resuleobj.success('大纲数据修改成功');
            res.json(resuleobj.result);
        });
    });
       
}

// 物理删除大纲数据
exports.delsectioninfo =(req,res)=>{
    // 获取要删除的大纲id字符串，格式：1,2,3
    let ids = req.params.ids;

    let sql = `select c1.id from (
        select c.* from dt_goods_section c
          where  c.id in (${ids})
          ) temp
        inner join dt_goods_section c1
          on (POSITION(concat(concat(',',temp.id),',') IN c1.class_list) )`;

    commonProcess.execSqlCallBack(req, res, sql, (err, datas) => {
        if (err) {
            resuleobj.fail('大纲子数据获取异常' + err.message);
            res.json(resuleobj.result);
            return;
        }
    
        let allCateIds = datas.map(item=>item.id).join(',');
        
        // 实现删除操作(包括自己和子大纲)
        let delSql = ` delete from dt_goods_section where id in (${allCateIds})`;
        
        commonProcess.execSqlCallBack(req, res, delSql, (err2, datas2) => {
            if (err2) {
                resuleobj.fail('大纲数据删除异常' + err2.message);
                res.json(resuleobj.result);
                return;
            }

        // 返回
        resuleobj.success('大纲数据删除成功');
        res.json(resuleobj.result);
        });
        
    });
  
}