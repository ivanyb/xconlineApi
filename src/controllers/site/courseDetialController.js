var config = require('../../config/config.js');
var commonProcess = require('../../common/commonProcess.js');
var resuleobj = require('../../config/resultobj.js');

// 根据课程id获取课程详情
exports.getCourseDetial = (req,res) =>{

    let warpObj = {
        BreadCrumbs:[], //存储面包屑导航数据
        CourseDetial:{}  //课程详情
    };

    // 1.0 获取课程详情页面中的 面包屑导航数据（课程 \ 编程入门）
    let sql = ` SELECT dac.id,dac.title FROM dt_article_category dac WHERE
    (SELECT COUNT(1) FROM (
     SELECT c1.class_list from dt_goods g1
    INNER JOIN dt_article_category c1 on (g1.category_id = c1.id)
    WHERE g1.id = 103) AS t where LOCATE(dac.id,t.class_list)
    ) `;

    commonProcess.execSqlCallBack(req,res,sql,(err,data)=>{
        if(err){
            resuleobj.fail('课程详情面包屑数据异常:'+ err.message);
            res.json(resuleobj.result);
            return;
        }

        // 赋值
        warpObj.BreadCrumbs = data?data:[];  
        
        
        // 2.0 获取课程详情数据
        let cid = req.params.id;
        let sql1 = ` SELECT id,title,sub_title,sell_price,market_price ,lesson_level, lesson_time,click ,lesson_star ,leson_type,
        content,common_question,CONCAT('${config.imgDomain}',teacher_img) as teacher_img,teacher_name,teacher_desc FROM dt_goods where id = ${cid}`;

        commonProcess.execSqlCallBack(req,res,sql1,(err1,data1)=>{
            if(err1){
                resuleobj.fail('课程详情数据异常:'+ err.message);
                res.json(resuleobj.result);
                return;
            }

            // 赋值
            if(data1){
                warpObj.CourseDetial = data1[0];
                // 将富文本中的图片地址加上api域名前缀以保持浏览器能访问到该图片
                warpObj.CourseDetial.content =warpObj.CourseDetial.content.replace(/\/upload/g,`${config.imgDomain}/upload`);
                warpObj.CourseDetial.common_question =warpObj.CourseDetial.common_question.replace(/\/upload/g,`${config.imgDomain}/upload`);
            }
           

            // 返回                   
            resuleobj.success(warpObj);
            res.json(resuleobj.result);
        });



    });
    
}

// 获取课程大纲数据
exports.getOutline = (req,res) =>{
    let cid = req.params.id;

    let sql = ` SELECT id,goods_id,parent_id,section_sortid,section_name,is_free,video_time,
    CONCAT('${config.imgDomain}',video_path) AS video_path   FROM dt_goods_section  
  WHERE goods_id = ${cid} `;

  commonProcess.execSqlCallBack(req,res,sql,(err,data)=>{
    if(err){
        resuleobj.fail('课程大纲数据异常:'+ err.message);
        res.json(resuleobj.result);
        return;
    }

      // 返回                   
      resuleobj.success(data);
      res.json(resuleobj.result);
});

}


// 根据小节id获取改小节详细数据
exports.getSectionInfo = (req,res) => {

    let sid = req.params.sectionid;

    let sql = ` select
                    id,
                    goods_id,                       
                    section_name,
                    is_free,                    
                    CONCAT('${config.imgDomain}',video_path) AS video_path ,
                    video_time,
                    CONCAT('${config.imgDomain}',code_path) AS code_path,
                    CONCAT('${config.imgDomain}',notes_path) AS notes_path                    
                from dt_goods_section 
                where id = ${sid}`;

    

    commonProcess.execSqlCallBack(req,res,sql,(err,data)=>{
        if(err){
            resuleobj.fail('课程小节详细数据异常:'+ err.message);
            res.json(resuleobj.result);
            return;
        }
    
        // 返回                   
        resuleobj.success(data?data[0]:{});
        res.json(resuleobj.result);
    });

}

// 根据小节id分页获取问答数据
exports.getSectionQAByPage = (req,res) => {
    
    let sid = req.params.sectionid;  //章节id
  
    let sqlCount = ` select count(1) as count from dt_section_question where parent_id = 0 and section_id = ${sid} `;

    commonProcess.execQueryCount(req,res,sqlCount,(pageobj)=>{

        // 分页获取问题数据
        let sql =` SELECT id,parent_id,section_id,user_id,user_name,user_ip,content,add_time,is_reply,reply_count
          FROM dt_section_question 
        where section_id = ${sid} AND parent_id = 0 order by id desc 
        limit ${pageobj.skipCount},${pageobj.pageSize} `;

        commonProcess.execSqlCallBack(req,res,sql,(err,datas)=>{
            if(err){
                resuleobj.fail('章节问题分页数据获取失败:');
                res.json(resuleobj.result); 
                return;
            }

            // 根据问题数据，获取每个问题下面的回答数据
            let ids = (datas && datas.length>0)? datas.map(item=>item.id).join(','):'0';
            // console.log(ids);
            let sqlLevel2 = ` select * from  dt_section_question where parent_id in (${ids})`;
            commonProcess.execSqlCallBack(req,res,sqlLevel2,(err1,datas1)=>{
                if(err1){
                    resuleobj.fail('章节问题回复数据获取失败:');
                    res.json(resuleobj.result); 
                    return;
                }

                // 一个问题一个回复包装处理
                // datas:表示问题数据对象数组，d表示某一条问题对象
                datas.forEach(d=>{
                    // datas1:表示回复数据对象数组 ,找到问题的所有回复数据
                    d.content = d.content.replace(/\/upload/g,`${config.imgDomain}/upload`);
                    d.replyList = datas1.filter(data=>data.parent_id == d.id);
                    d.replyList.forEach(rr=>rr.content = rr.content.replace(/\/upload/g,`${config.imgDomain}/upload`));
                });
                 

                // 返回1
                resuleobj.successByPage(datas,pageobj.totalCount,pageobj.pageIndex,pageobj.pageSize);
                res.json(resuleobj.result);

            });

           
        });

    });    
}

// 问题数据提交
exports.PostSectionQuestion = (req,res) => {
    if(!req.session.admin_user){
        resuleobj.noLogin('登录失效，请重新登录');
        res.json(resuleobj.result); 
        return;
    }

    let sql = `INSERT INTO dt_section_question
                (
                section_id
                ,parent_id
                ,user_id
                ,user_name
                ,user_ip
                ,content
                ,add_time
                ,is_reply,
                reply_count                
                )
                VALUES
                (
                 ${req.body.section_id},
                 0,
                 '${req.session.admin_user.uid}',
                 '${req.session.admin_user.uname}',
                 '${commonProcess.getClientIp(req)}',
                 '${req.body.content}',
                 NOW(),
                 0,
                 0
                );`;

        commonProcess.execSqlCallBack(req,res,sql,(err,datas)=>{
            if(err){
                resuleobj.fail('问题提交失败:'+ err.message);
                res.json(resuleobj.result); 
                return;
            }

            // 返回
            resuleobj.success('问题提交成功');
            res.json(resuleobj.result);
        });
}

// 问题回复数据提交
exports.PostSectionResult = (req,res) => {
    if(!req.session.admin_user){
        resuleobj.noLogin('登录失效，请重新登录');
        res.json(resuleobj.result); 
        return;
    }

    let sql = `INSERT INTO dt_section_question
                (
                section_id
                ,parent_id
                ,user_id
                ,user_name
                ,user_ip
                ,is_reply
                ,add_time
                ,content
                ,reply_count
                )
                VALUES
                (
                ${req.body.section_id},
                ${req.body.parent_id},
                '${req.session.admin_user.uid}',
                '${req.session.admin_user.uname}',
                '${commonProcess.getClientIp(req)}',
                0,
                NOW(),
                '${req.body.content}',
                0
                );
                `;

        // console.log(sql);
        commonProcess.execSqlCallBack(req,res,sql,(err,datas)=>{
            if(err){
                resuleobj.fail('回复问题插入数据失败:');
                res.json(resuleobj.result); 
                return;
            }

            let sqlupdate = `update dt_section_question set is_reply = 1,reply_count = reply_count + 1 
            where id = ${req.body.parent_id} ;`
            commonProcess.execSqlCallBack(req,res,sqlupdate,(err1,datas1)=>{
                if(err1){
                    resuleobj.fail('回复问题更新数据失败:');
                    res.json(resuleobj.result); 
                    return;
                }

                 // 返回
            resuleobj.success('回复问题成功');
            res.json(resuleobj.result);

            });

           
        });
}

// 根据小节id分页获取笔记数据
exports.getSectionNotesByPage = (req,res) => {
    let sid = req.params.sectionid;  //章节id

    if(!req.session.admin_user){
        resuleobj.noLogin('登录失效，请重新登录');
        res.json(resuleobj.result); 
        return;
    }

    let userid = req.session.admin_user.uid;  //登录用户的id
    
      let sqlCount = ` select count(1) as count from dt_section_notes where section_id = ${sid} and user_id=${userid} `;
  
      commonProcess.execQueryCount(req,res,sqlCount,(pageobj)=>{
  
        
          let sql =` SELECT *  FROM dt_section_notes 
          where section_id = ${sid} and user_id=${userid}  order by id desc 
          limit ${pageobj.skipCount},${pageobj.pageSize} `;
  
          commonProcess.execSqlCallBack(req,res,sql,(err,datas)=>{
              if(err){
                  resuleobj.fail('章节笔记分页数据获取失败:'+ err.message);
                  res.json(resuleobj.result); 
                  return;
              }
  
              // 返回
             resuleobj.successByPage(datas,pageobj.totalCount,pageobj.pageIndex,pageobj.pageSize);
             res.json(resuleobj.result);
          });
  
      });

}

// 笔记提交
exports.PostNotes = (req,res) => {
    if(!req.session.admin_user){
        resuleobj.noLogin('登录失效，请重新登录');
        res.json(resuleobj.result); 
        return;
    }

    let sql = `INSERT INTO dt_section_notes
                (
                section_id
                ,user_id
                ,user_name
                ,user_ip
                ,notes_content
                ,add_time
                )
                VALUES
                (
                ${req.body.section_id},               
                '${req.session.admin_user.uid}',
                '${req.session.admin_user.uname}',
                '${commonProcess.getClientIp(req)}',               
                '${req.body.content}'
                ,NOW()
                ); `;
// console.log(sql);
        commonProcess.execSqlCallBack(req,res,sql,(err,datas)=>{
            if(err){
                resuleobj.fail('提交笔记失败:'+ err.message);
                res.json(resuleobj.result); 
                return;
            }

            // 返回
            resuleobj.success('提交笔记成功');
            res.json(resuleobj.result);
        });
}