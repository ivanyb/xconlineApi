var config = require('../../config/config.js');
var commonProcess = require('../../common/commonProcess.js');
var resuleobj = require('../../config/resultobj.js');


// 获取课程首页左边数据分类和轮播图
exports.gettopdata = (req,res)=>{
  
	// 1.0 当前频道所有分类数据
	let categorySql = `select * from dt_article_category where channel_id=2 ORDER BY parent_id`;
    commonProcess.execSqlCallBack(req,res,categorySql,(cateErr,cateDatas)=>{
		if(cateErr){
                resuleobj.fail('获取分类数据异常:'+ cateErr.message);
                res.json(resuleobj.result); 
                return;
			}
			
			gCateDatas = cateDatas;
			// 递归获取分类数据
			let parentid = 0;
			let subcatelist = [];
			let classlayer=1;
			getcategory(parentid,classlayer,subcatelist);
			

			let warpobj = {};
			// 商品列表页面顶部左边的商品菜单数据
			warpobj.catelist = subcatelist;	


            // 获取首页轮播图课程数据
			let sql = ` 
            SELECT id,title,CONCAT('${config.imgDomain}',img_url) as img_url FROM dt_goods 
             WHERE status=0 and is_slide=1 ORDER BY id DESC LIMIT 0,5
			`;

			commonProcess.execSqlCallBack(req,res,sql,(err,datas)=>{
            	if(err){
                    resuleobj.fail('轮播图数据获取异常:'+ err.message);
                    res.json(resuleobj.result); 
                    return;
                }

            // 获取轮播数据
            warpobj.sliderlist = datas;


            // 赋值和返回            
            resuleobj.success(warpobj);
            res.json(resuleobj.result);

			});
		});
}

// 递归获取分类数据
function getcategory(parentid,classlayer,subcatelist){
	let levelList = gCateDatas.filter(item=>item.parent_id == parentid);
	if(!levelList ||levelList.length<=0){
		return;
	}

	if(parentid == 0){		
		levelList.forEach((lv1item)=>{
			let itemobj = {id:lv1item.id,pid:lv1item.parent_id,class_layer:lv1item.class_layer,title:lv1item.title,subcates:[]};
			getcategory(lv1item.id,++lv1item.class_layer,itemobj.subcates);
			subcatelist.push(itemobj);
		});			
	}else if(parentid >0){
		levelList.forEach((subitem)=>{
			let subobj = {id:subitem.id,pid:subitem.parent_id,class_layer:subitem.class_layer,title:subitem.title,subcates:[]};
			getcategory(subitem.id,++subitem.class_layer,subobj.subcates);
			subcatelist.push(subobj);
		});
    }
    // else if(parentid >0 && classlayer >=3 ){
	// 	levelList.forEach((subitem)=>{
	// 		let subobj = {id:subitem.id,pid:subitem.parent_id,class_layer:subitem.class_layer,title:subitem.title};
	// 		getcategory(subitem.id,++subitem.class_layer,subcatelist);
	// 		subcatelist.push(subobj);
	// 	});
	// }
}

// 获取课程列表
exports.getCourselist = (req,res) => {
    // 获取一级分类
    let sql = `select c.id,c.title,
    CONCAT('${config.imgDomain}',c.img_url) as img_url    
    ,CONCAT('${config.imgDomain}',c.img1_url) as img1_url
    from dt_article_category as c where c.parent_id = 0`;

    // 获取一级分类下面的符合条件的5门热门课程 < 5 表示取5条
    let sqlCourseList = ` SELECT g1.category_id_top,g1.id, g1.title, CONCAT('${config.imgDomain}',g1.img_url) AS img_url,g1.lesson_level,g1.click  FROM dt_goods g1 
    WHERE 
    (SELECT COUNT(1) FROM dt_goods g2 WHERE g1.category_id_top = g2.category_id_top AND g1.id < g2.id) < 5 
    AND g1.is_hot = 1 and g1.status=0 `;

    // 定义每个课程下面的热门，初级，中级，高级分类数据
    let types = config.courseTypes;

    // 执行sql获取数据包装成返回数组
    let resList={
        types:types,
        datas:[]
    }
    
    commonProcess.execSqlCallBack(req,res,sql,(cateErr,cateDatas)=>{
		if(cateErr){
                resuleobj.fail('获取一级分类数据异常:'+ cateErr.message);
                res.json(resuleobj.result); 
                return;
            }

            // 获取课程数据
            commonProcess.execSqlCallBack(req,res,sqlCourseList,(err,datas)=>{
                if(err){
                    resuleobj.fail('获取课程列表数据异常:'+ err.message);
                    res.json(resuleobj.result); 
                    return;
                }

            // 数据包装处理
            cateDatas.forEach(cateItem=>{
                cateItem.courseList = datas.filter(c=>c.category_id_top ==cateItem.id);
                resList.datas.push(cateItem);
            })

            // 返回
            resuleobj.success(resList);
            res.json(resuleobj.result);

            });        
        });

}

// 获取课程首页精品推荐数据 （取最新的10条）
exports.getTopCourseList = (req,res) =>{
    let sql = ` SELECT g1.category_id_top,g1.category_id,g1.id, g1.title,g1.sub_title,g1.is_hot, CONCAT('${config.imgDomain}',g1.img_url) AS img_url,g1.lesson_level,g1.click  
    FROM dt_goods g1 WHERE g1.status=0 and g1.is_top = 1 ORDER BY id desc LIMIT 0,10`;

    commonProcess.execSqlCallBack(req,res,sql,(err,datas)=>{
        if(err){
            resuleobj.fail('获取精品课程列表数据异常:'+ err.message);
            res.json(resuleobj.result); 
            return;
        }

        // 返回
        resuleobj.success(datas);
        res.json(resuleobj.result);
    });
}

// 用户点击热门，初级，中级，高级获取相应的课程数据 （取最新的5条） /getcourselistByType/:cate_top_id/:type_id
exports.getcourselistByType = (req,res) =>{
    let cate_top_id = req.params.cate_top_id;
    let type_id = req.params.type_id;

    let sql = ` SELECT g1.category_id_top,g1.category_id,g1.id, g1.title,g1.is_hot, CONCAT('${config.imgDomain}',g1.img_url) AS img_url,g1.lesson_level,g1.click  
    FROM dt_goods g1  WHERE (g1.category_id_top = ${cate_top_id} and  g1.is_hot = ${type_id} and g1.status=0) 
    OR (g1.category_id_top = ${cate_top_id} and  g1.lesson_level_id = ${type_id} and g1.status=0) 
    ORDER BY g1.id DESC LIMIT 0,5`;
  
    commonProcess.execSqlCallBack(req,res,sql,(err,datas)=>{
        if(err){
            resuleobj.fail(`获取${cate_top_id}分类下的${config.courseTypes.filter(item=>item.tid==type_id)[0].title}数据异常:`+ err.message);
            res.json(resuleobj.result); 
            return;
        }

        // 返回
        resuleobj.success(datas);
        res.json(resuleobj.result);
    });
}