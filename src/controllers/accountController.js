
var md5 = require('md5');
var config = require('../config/config.js');
// var jwt = require('jsonwebtoken');// 使用jwt签名
var commonProcess = require('../common/commonProcess.js');

var resuleobj = require('../config/resultobj.js')

exports.login = (req, res) => {

    let uname = req.body.user_name;
    let upwd = md5(req.body.password);
    // let upwd = req.body.upwd;
    console.log(uname);
    console.log(upwd);

    let sql = `select * from dt_users where user_name='${uname}' and password='${upwd}' `;
    console.log(sql);

    commonProcess.execSqlCallBack(req,res,sql
        ,(err,datas) => { 
            if(err){
                resuleobj.fail(err.message);
                res.json(resuleobj.result); 
                return;
            }

            if(datas.length==0){
                resuleobj.fail('用户名或密码错误');
                res.json(resuleobj.result); 
                return;
            }

            // let token = jwt.sign({ uname: uname, uid:datas[0].id,role:datas[0].role}, config.jwtslat, {
            //             expiresIn: 1800// 授权时效30分钟
            //         });

            var data = datas[0]; 
            var user = {uid:data.id,uname:data.user_name,role:data.role,nick_name:data.nick_name}
            req.session.admin_user = user;
            console.log(req.session.admin_user);
            
            resuleobj.success({text:'登录成功',user:user});
            res.json(resuleobj.result);
        });
}


// 注销
exports.logout = (req,res)=>{
	resobj = {};
	
	if(req.session && req.session.admin_user){
		req.session.admin_user = null;
	}

    resuleobj.success({text:'用户已注销'});
    res.json(resuleobj.result);
}


// 检查是否有登录  
exports.islogin = (req,res)=>{
	if(req.session && req.session.admin_user){ 
        resuleobj.success(req.session.admin_user);
        res.json(resuleobj.result);
	}
	else{
        resuleobj.noLogin('用户未登录');
        res.json(resuleobj.result);
	}
}

// 注册
exports.register = (req,res)=>{
    

    let insertSql = `INSERT INTO dt_users
                   (group_id,role,user_name,password,mobile,reg_time,reg_ip)
                   VALUES
                   (
                     1
                    ,${req.body.role}
                    ,'${req.body.user_name}'
                    ,'${md5(req.body.password)}'
                    ,'${req.body.user_name}'
                    ,NOW() 
                    ,'${commonProcess.getClientIp(req)}' 
                   );`;

        let checksnscoddSql = `select * from dt_sns where sns_code='${req.body.sns_code}'`;
        let checkusernameSql = `select * from dt_users where user_name='${req.body.user_name}'`;

        commonProcess.execSqlCallBack(req,res,checkusernameSql,(err2,data2)=>{
            if(err2){
                resuleobj.fail('注册用户名检查过程异常：' + err2.message);
                res.json(resuleobj.result); 
                return;
                }
            
            if(data2.length > 0){
                resuleobj.fail(`用户名:${req.body.user_name} 已存在，请更换一个`);
                res.json(resuleobj.result); 
                return;
            }

       

        commonProcess.execSqlCallBack(req,res,checksnscoddSql,(err1,data1)=>{
            if(err1){
                resuleobj.fail('验证码检查过程异常：' + err1.message);
                res.json(resuleobj.result); 
                return;
                }
            
            if(data1.length <= 0){
                resuleobj.fail('验证码错误');
                res.json(resuleobj.result); 
                return;
            }

            // 注册 
            commonProcess.execSqlCallBack(req,res,insertSql,(err,data)=>{
                    if(err){
                        resuleobj.fail(err.message);
                        res.json(resuleobj.result); 
                        return;
                        }

                        resuleobj.success({text:'用户注册成功'});
                        res.json(resuleobj.result);                     
                });

        });

    });
}

// 检查用户名是否已经注册
exports.checkuser = (req,res) =>{
    let username = req.body.username;
    let sql =`select user_name from dt_users where user_name='${username}'`;
    commonProcess.execSqlCallBack(req,res,sql,(err,data)=>{
                    if(err){
                        resuleobj.fail(err.message);
                        res.json(resuleobj.result); 
                        return;
                        }
                      console.log(data)  
                    if(data.length >0)
                    {
                        resuleobj.success({text:'用户名已经注册，请更换一个',isRegister:true});
                        res.json(resuleobj.result);   
                    }else{
                        resuleobj.success({text:'用户名可用',isRegister:false});
                        res.json(resuleobj.result);   
                    }
                                        
               });
}

// 获取短信验证码
var request = require('request');
var {createRandom} = require('../common/genRandom.js');
exports.snscode = (req,res)=>{
    let mobile = req.body.username;

    let vcode = createRandom(6);

    console.log(mobile);
    console.log(vcode);
    // res.json({m:mobile,vcode:vcode});
    // return;
    resuleobj.fail('短信验证接口已关闭：请使用固定验证码：888888');
    res.json(resuleobj.result); 
    return;

    
    let url = `http://v.juhe.cn/sms/send?mobile=${mobile}&tpl_id=105762&tpl_value=%23code%23%3D${vcode}&key=53cd364bc4ab2124bea90cba2bc04cbb`

    request(url,
     function (error, response, body) {
        if (!error && response.statusCode == 200) {
        
         // 将验证码保存到数据库中
         let sql = `insert into dt_sns(sns_code,add_time) values('${vcode}',NOW())`;
         commonProcess.execSqlCallBack(req,res,sql,(err,data)=>{
            if(err){
                resuleobj.fail('数据库操作失败');
                res.json(resuleobj.result); 
                return;
                }
           
                resuleobj.success(JSON.parse(body));
                res.json(resuleobj.result);
                      
       });       
        }else{
            resuleobj.fail(error.message);
            res.json(resuleobj.result);
        }
      })
}