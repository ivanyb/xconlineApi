var config = require('../../config/config.js');
var commonProcess = require('../../common/commonProcess.js');
var resuleobj = require('../../config/resultobj.js');

// 获取课程列表页一级分类和其他分类
exports.getCateList = (req,res) => {

    // 返回的对象
    let resObj = {
          cate_Top_List:[{
            "id": -1,
            "title": "全部",
            "parent_id": -1,
            "class_layer": -1,
            "class_list": ',-1,'
        }],
        cate_Other_List:[{
            "id": -1,
            "title": "全部",
            "parent_id": -1,
            "class_layer": -1,
            "class_list": ',-1,'
        }],
        course_types:[{
            "tid": -1,
            "title": "全部"
        }].concat(config.courseTypes)
    }

    // 获取分类数据
    let sql = ` SELECT id,title,parent_id,class_layer,class_list FROM dt_article_category WHERE channel_id = 2 `;

    commonProcess.execSqlCallBack(req,res,sql,(err,datas)=>{
        if(err){
            resuleobj.fail('分类数据获取异常:'+ err.message);
            res.json(resuleobj.result); 
            return;
        }

        // 一级分类
        resObj.cate_Top_List= resObj.cate_Top_List.concat(datas.filter(item=>item.parent_id == 0));
        // 其他分类
        resObj.cate_Other_List =  resObj.cate_Other_List.concat(datas.filter(item=>item.parent_id > 0));

         // 赋值和返回            
         resuleobj.success(resObj);
         res.json(resuleobj.result);

    });
}

// 根据分类分页获取课程数据
exports.getCourseList = (req,res) =>{

    let cate_top_id = req.query.cate_top_id;  //1级分类id
    let cate_id = req.query.cate_id;   // 2级及其以后分类id
    let type = req.query.type;    //课程标签和难度等级

    let where = ``;
    if(cate_top_id && cate_top_id != '-1'){
        where += ` and category_id_top=${cate_top_id} `
    }
    if(cate_id && cate_id!= '-1'){
        where += ` and category_id=${cate_id} `
    }
    if(type && type!= '-1'){
        where += ` and lesson_level_id=${type} `
    }

    let sqlCount = ` select count(1) as count from dt_goods where status=0 ${where} `;

    commonProcess.execQueryCount(req,res,sqlCount,(pageobj)=>{

        let sql =` SELECT category_id_top,category_id,id, title,is_hot, CONCAT('${config.imgDomain}'
        ,img_url) AS img_url,lesson_level,click,sub_title  FROM dt_goods 
        where status=0  ${where} order by id desc
        limit ${pageobj.skipCount},${pageobj.pageSize} `;

        commonProcess.execSqlCallBack(req,res,sql,(err,datas)=>{
            if(err){
                resuleobj.fail('课程分页数据获取失败:'+ err.message);
                res.json(resuleobj.result); 
                return;
            }

            // 返回
           resuleobj.successByPage(datas,pageobj.totalCount,pageobj.pageIndex,pageobj.pageSize);
           res.json(resuleobj.result);
        });

    });
}