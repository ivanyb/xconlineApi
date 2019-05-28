var config = require('../../config/config.js');
var commonProcess = require('../../common/commonProcess.js');
var resuleobj = require('../../config/resultobj.js');
var kits = require('../../common/kits.js');

// 获取课程各种属性：热门，置顶，轮播，初级，中级，高级数据
exports.getCourseTypes = (req, res) => {
    let types = [{ tid: -1, title: '所有' }].concat(config.courseTypes.concat([
        { tid: 5, title: '置顶' },
        { tid: 6, title: '轮播' }
    ]));

    resuleobj.success(types);
    res.json(resuleobj.result);
}

// 分页获取课程数据
exports.getCourseListByPager = (req, res) => {

    let cate_id = req.query.cate_id;   // 分类id
    /*type数据：
     {tid:1,title:'热门'},
        {tid:2,title:'初级'},
        {tid:3,title:'中级'},
        {tid:4,title:'高级'}，
         { id: 5, title: '置顶' },
        { id: 6, title: '轮播' }
        */
    let type = req.query.type;    //课程标签和难度等级 ，数据来源于：/nc/admin/getCourseTypes
    let title = req.query.title; //课表标题

    let where = ``;
    if (cate_id && cate_id != '-1') {
        where += ` and category_id=${cate_id} `
    }

    if(title && title.length > 0){
        where += ` and title like '%${title}%' `;
    }

    if (type && type != '-1') {
        switch (type) {
            case '1':
                where += ` and is_hot=1 `
                break;
            case '5':
                where += ` and is_top=1 `
                break;
            case '6':
                where += ` and is_slide=1 `
                break;
            case '2':
            case '3':
            case '4':
                where += ` and lesson_level_id=${type} `
                break;

        }
    }

    let sqlCount = ` select count(1) as count from dt_goods where status=0 and user_id = ${req.session.admin_user.uid} ${where} `;

    commonProcess.execQueryCount(req, res, sqlCount, (pageobj) => {

        let sql = ` SELECT  id, title,is_hot, is_top,is_slide,CONCAT('${config.imgDomain}'
        ,img_url) AS img_url,lesson_level,click,lesson_star,sub_title,add_time  FROM dt_goods 
        where status=0 and user_id = ${req.session.admin_user.uid}  ${where} order by id desc
        limit ${pageobj.skipCount},${pageobj.pageSize} `;

        commonProcess.execSqlCallBack(req, res, sql, (err, datas) => {
            if (err) {
                resuleobj.fail('课程分页数据获取失败:' + err.message);
                res.json(resuleobj.result);
                return;
            }

            // 返回
            resuleobj.successByPage(datas, pageobj.totalCount, pageobj.pageIndex, pageobj.pageSize);
            res.json(resuleobj.result);
        });

    });
}

// 根据id删除课程数据
exports.deleteCourse = (req,res) =>{
    let ids = req.params.ids;

    if(ids || ids.length<=0){
        resuleobj.fail('请至少选择一个要删除的课程');
        res.json(resuleobj.result);
        return;
    }

    let sql = ` update dt_goods set status=1 where id in (${ids}) and user_id = ${req.session.admin_user.uid} `;

    commonProcess.execSqlCallBack(req, res, sql, (err, datas) => {
        if (err) {
            resuleobj.fail('删除课程数据失败:' + err.message);
            res.json(resuleobj.result);
            return;
        }

        // 返回
        resuleobj.success('所选课程已删除');
        res.json(resuleobj.result);
    });

}

// 根据课程id获取课程数据
exports.getCourseInfoById = (req,res)=>{
    if(!req.session.admin_user){
        resuleobj.noLogin('登录失效，请重新登录');
        res.json(resuleobj.result); 
        return;
    }

    let id = req.params.id;
    let sql = ` select * from dt_goods where id=${id} AND user_id = ${req.session.admin_user.uid} `;

    commonProcess.execSqlCallBack(req, res, sql, (err, datas) => {
        if (err) {
            resuleobj.fail('根据id获取课程失败:' + err.message);
            res.json(resuleobj.result);
            return;
        }

        // 返回
        resuleobj.success(datas);
        res.json(resuleobj.result);
    });
}

// 编辑课程数据 post请求
exports.editCourseInfo = (req,res)=>{
    
    if(!req.session.admin_user){
        resuleobj.noLogin('登录失效，请重新登录');
        res.json(resuleobj.result); 
        return;
    }

    // 获取post过来的数据
    let id = req.body.id;
    let category_id_top = 0;
    let category_id = req.body.category_id;
    let title = req.body.title;
    let sub_title = req.body.sub_title;
    let img_url = req.body.img_url;
    let market_price = req.body.market_price;
    let sell_price = req.body.sell_price;
    let lesson_level_id = req.body.lesson_level_id;

    let typeArr = config.courseTypes.filter(item=>item.tid == lesson_level_id);
    if(!typeArr || typeArr.length <=0){
        resuleobj.fail('课程级别id传入非法');
        res.json(resuleobj.result);
        return;
    }

    let lesson_level = typeArr[0].title;
    let lesson_star = req.body.lesson_star;
    let content = req.body.content;
    let common_question = req.body.common_question;
    let timeout = req.body.timeout;
    let is_top = req.body.is_top;
    let is_hot = req.body.is_hot;
    let is_slide = req.body.is_slide;
    let teacher_img = req.body.teacher_img;
    let teacher_name = req.body.teacher_name;
    let teacher_desc = req.body.teacher_desc;
    let status = req.body.status;

    // 根据category_id获取顶级id
    let sqlQueryCate = `select class_list from dt_article_category where id= ${category_id}`;
    commonProcess.execSqlCallBack(req, res, sqlQueryCate, (err, cateclass) => {
        if (err) {
            resuleobj.fail('根据id获取课程类别失败:' + err.message);
            res.json(resuleobj.result);
            return;
        }

        if(!cateclass || cateclass.length<=0){
            resuleobj.fail('传入的category_id值非法');
            res.json(resuleobj.result);
            return;
        }
        // 当前分类的顶级分类id
        category_id_top = cateclass[0].class_list.split(',')[1];

        // 更新数据
        let sqlupdate = `        
        UPDATE dt_goods 
        SET
          category_id_top =  ${category_id_top}
         ,category_id = ${category_id}
         ,title = '${title}'
         ,sub_title ='${sub_title}'
         ,img_url = '${img_url}'
         ,market_price = ${market_price}
         ,sell_price =${sell_price}
         ,lesson_level_id = ${lesson_level_id}
         ,lesson_level = '${lesson_level}'         
         ,lesson_star = ${lesson_star}
         ,content = '${content}' 
         ,common_question = '${common_question}'
         ,timeout = ${timeout}
         ,is_top = ${is_top}
         ,is_hot =${is_hot}
         ,is_slide = ${is_slide}
         ,status= ${status}
         ,update_time = NOW()        
        WHERE
          id = ${id} AND user_id = ${req.session.admin_user.uid}        
        `;
// console.log(sqlupdate)
        commonProcess.execSqlCallBack(req, res, sqlupdate, (err1, datas) => {
            if (err1) {
                resuleobj.fail('更新课程失败' + err.message);
                res.json(resuleobj.result);
                return;
            }

            // 返回
            resuleobj.success('更新课程成功');
            res.json(resuleobj.result);
        });       

    });

}


// 新增课程
exports.addCourse = (req,res) =>{
    if(!req.session.admin_user){
        resuleobj.noLogin('登录失效，请重新登录');
        res.json(resuleobj.result); 
        return;
    }

    // 获取post过来的数据
   
    let category_id = req.body.category_id;
    let title = req.body.title;
    let sub_title = req.body.sub_title;
    let img_url = req.body.img_url;
    let market_price = req.body.market_price;
    let sell_price = req.body.sell_price;
    let lesson_level_id = req.body.lesson_level_id;

    let typeArr = config.courseTypes.filter(item=>item.tid == lesson_level_id);
    if(!typeArr || typeArr.length <=0){
        resuleobj.fail('课程级别id传入非法');
        res.json(resuleobj.result);
        return;
    }

    let lesson_level = typeArr[0].title;
    let lesson_star = req.body.lesson_star;
    let content = req.body.content;
    let common_question = req.body.common_question;
    let timeout = req.body.timeout;
    let is_top = req.body.is_top;
    let is_hot = req.body.is_hot;
    let is_slide = req.body.is_slide;
    let teacher_img = req.body.teacher_img;
    let teacher_name = req.body.teacher_name;
    let teacher_desc = req.body.teacher_desc;
    let status = req.body.status;

    // 根据category_id获取顶级id
    let sqlQueryCate = `select class_list from dt_article_category where id= ${category_id}`;
    commonProcess.execSqlCallBack(req, res, sqlQueryCate, (err, cateclass) => {
        if (err) {
            resuleobj.fail('根据id获取课程类别失败:' + err.message);
            res.json(resuleobj.result);
            return;
        }

        if(!cateclass || cateclass.length<=0){
            resuleobj.fail('传入的category_id值非法');
            res.json(resuleobj.result);
            return;
        }
        // 当前分类的顶级分类id
        let category_id_top = 0;
        category_id_top = cateclass[0].class_list.split(',')[1];

        // 插入数据
        let insertSql = `
                        INSERT INTO dt_goods
                        (
                        category_id_top
                        ,category_id
                        ,title
                        ,sub_title
                        ,img_url
                        ,market_price
                        ,sell_price
                        ,lesson_level_id
                        ,lesson_level
                        ,lesson_time
                        ,lesson_star
                        ,leson_type
                        ,tags
                        ,content
                        ,common_question
                        ,count
                        ,timeout
                        ,is_top
                        ,is_hot
                        ,is_slide
                        ,sort_id
                        ,click
                        ,status
                        ,user_id
                        ,user_name
                        ,add_time
                        ,update_time
                        ,teacher_img
                        ,teacher_name
                        ,teacher_desc
                        )
                        VALUES
                        (
                        ${category_id_top}
                        ,${category_id}
                        ,'${title}'
                        ,'${sub_title}'
                        ,'${img_url}'
                        ,${market_price}
                        ,${sell_price}
                        ,${lesson_level_id}
                        ,'${lesson_level}'
                        ,0
                        ,${lesson_star}
                        ,'录播'
                        ,''
                        ,'${content}' 
                        ,'${common_question}'
                        ,0
                        ,${timeout}
                        ,${is_top}
                        ,${is_hot}
                        ,${is_slide}
                        ,0
                        ,8698
                        ,${status}
                        ,${req.session.admin_user.uid}
                        ,'${req.session.admin_user.uname}'
                        ,NOW()
                        ,NULL
                        ,'/upload/teacherimg.jpg'
                        ,'黑马高级讲师'
                        ,'计算机硕士，专注于IT编程领域20年，猎涉多门编程语言，参与多个国家级计算机项目，多年培训经验，丰富的教学讲解经验'
                        );
                        `;

            commonProcess.execSqlCallBack(req, res, insertSql, (err1, datas) => {
                if (err1) {
                    resuleobj.fail('新增课程失败' + err1.message);
                    res.json(resuleobj.result);
                    return;
                }

                // 返回
                resuleobj.success('新增课程成功');
                res.json(resuleobj.result);
            });        
      
    });

}
