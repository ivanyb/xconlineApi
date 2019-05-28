'use strict'

const express = require('express');
const path = require('path');
const url = require('url');
var resuleobj = require('./src/config/resultobj.js');

let app = express();
// 设置项目静态文件路径
let phyPath = path.join(__dirname ,'/public/');
app.use(express.static(phyPath));


// 自动解析请求报文
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser());

//1.0 初始化orm
const orm = require('orm');
app.use(orm.express('mysql://root:123456@localhost:3306/xonline', {
	define: function (db, models, next) {
		next();
	}
}));

var domains={
	local:'http://localhost',
	loc127:'http://127.0.0.1',
   dist:"http://157.122.54.189:9090",
   dist1:"http://192.168.50.2:9091",
   dist2:"http://172.16.2.23:9091",
   dist3:"http://103.44.145.245"
};


app.all('*',(req,res,next)=>{
//设置允许跨域响应报文头
//设置跨域
// console.log('host=',req.headers.origin ); //req.headers.origin获取请求源域名
var currentdomain="http://localhost";
for(let key in domains){
   if(!req.headers.origin){
	   break;
   }
   if(req.headers.origin.indexOf(domains[key])>-1){
	   currentdomain = req.headers.origin;
	   console.log(currentdomain);
	   break;
   }
}

res.header("Access-Control-Allow-Origin", currentdomain);//设置管理后台服务器路径http://127.0.0.1:5008
res.header("Access-Control-Allow-Headers", "X-Requested-With, accept,OPTIONS, content-type");
// res.header("Access-Control-Allow-Headers", "X-Requested-With");
res.header("Access-Control-Allow-Methods","*");
// 需要让ajax请求携带cookie ,此处设置为true，那么Access-Control-Allow-Origin 
// 不能设置为*，所以设置为请求者所在的域名
res.header("Access-Control-Allow-Credentials", "true");

//  如果当前请求时OPTIONS 则不进去真正的业务逻辑方法，防止执行多次而产生 
if(req.method!="OPTIONS"){
   res.setHeader('Content-Type','application/json;charset=utf-8');
	  next();
  }else{
	 res.end('');
  }
});

// 设置session（用户登录）
const  session = require('express-session');
app.use(session({
  secret: 'xczxsite',  //加密的秘钥，可以随便写
  resave: false,
  saveUninitialized: true,
  cookie:{maxAge:null}
  //cookie:{ path: '/account/'} //ajax请求/admin/下面的路径才带cookie到服务器
  //cookie: { secure: true } // 表示当浏览器第一次请求这个网站的时候，就会向浏览器写一个身份标识到它的cookie中
}));

app.all('/ch/*',(req,res,next)=>{
	// 包含有/admin/account/的请求跳过登录检查
	// if(req.url.indexOf('/admin/account/')>-1){
	// 	next();
	// 	return;
	// }
	if(req.session.admin_user == null)
	{
	    resuleobj.noLogin('登录已过期');
		res.json(resuleobj.result);
		return;
	}
	
	next();
});


app.all('/ch/admin',(req,res,next)=>{	
	if(req.session.admin_user == null)
	{
	    resuleobj.noLogin('登录已过期');
		res.json(resuleobj.result);
		return;
	}
	
	next();
});


if(req.session.admin_user.role == 0){
	console.log('您的账号没有权限访问该页面');
	resuleobj.fail('您的账号没有权限访问该页面');
	res.json(resuleobj.result);
	return;
}


//2.0 教室端管理相关路由设定
// 2.0.1 设置账号板块路由规则
const accountRoute = require('./src/routes/accountRoute.js');
app.use('/nc/common/account', accountRoute);

// 2.0.2 设定课程管理板块路由规则
const homeRouter = require('./src/routes/site/homeRouter.js'); //课程首页
app.use('/nc/course/home', homeRouter);

const courseListRouter = require('./src/routes/site/courseListRouter.js'); //课程列表页
app.use('/nc/course/courseList', courseListRouter);

const courseDetialRouter = require('./src/routes/site/courseDetialRouter.js'); //课程详情页(包括播放页的相关api)
app.use('/', courseDetialRouter);

const shopRouter = require('./src/routes/site/shopRouter.js'); //购物车和下单以及支付api（需要登录）
app.use('/', shopRouter);

const mycenterRouter = require('./src/routes/site/mycenterRouter.js'); // 个人中心相关操作
app.use('/ch/mycenter', mycenterRouter);

// 载入后台管理所有路由规则
require('./src/routes/admin/routerManger.js')(app);

// 2.0.3 设定订单管理板块路由规则
app.get('/site/home',(req,res)=>{
    res.json(req.session.admin_user || {text:'空'});
});

// 2.1 学生端系统路由规则设定


app.listen(9092, () => {
	console.log('api服务已启动, :9092');
});