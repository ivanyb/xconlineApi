# 数据服务说明

```
此文档提供了学成在线相关功能数据API调用说明

Api域名为：http://157.122.54.189:9092/

Api域名分为两类：  
http://157.122.54.189:9092/nc/.....  以/nc/开头的不需要检查是否登录  
http://157.122.54.189:9092/ch/.....  以/ch/开头的需要检查是否登录  
```



## 数据服务通用返回格式

>数据服务中所有api返回的格式均为json格式，响应正确时具体格式如下：

```json
  {
    "status": 0,
    "message":"",
    "totalCount":0,
    "pageIndex":1,
    "pageSize":10
  }
```

​     

| 字段         | 说明                                       |
| ---------- | ---------------------------------------- |
| status     | 数据服务的处理状态，有两个值：  1：表示服务器处理发生了异常 0：正常  2：未登录 |
| message    | 当status=1时，message为数据服务抛出的异常信息  status=0时 为正常数据，status=2时表示未登录 |
| totalCount | 分页获取数据时的数据总条数                            |
| pageIndex  | 分页获取数据时的当前页码                             |
| pageSize   | 分页获取数据时的每页显示条数                           |

​                                         


>响应错误时，数据服务会返回错误码1和错误信息，例如：

```json
{
  "status":1,
  "message":"数据服务中的错误信息"
}
```

## 关于set-cookie说明

>客户端首次访问数据服务接口的时候，服务器会自动向客户端写入一个cookieid，写入的方式是在响应报文头中通过set-cookie来实现
>必须配合Node服务器中的：res.header("Access-Control-Allow-Credentials", "true");来实现
***
>作用：做session登录状态管理的实现机制

***
>格式类似于：
>set-cookie:connect.sid=dvJ; Path=/; HttpOnly

***
>set-cookie中的值说明

| 参数          | 作用说明                                     |
| ----------- | ---------------------------------------- |
| set-cookie  | http响应报文头固定参数，作用是会将其后面的值写入到浏览器的cookie中   |
| connect.sid | 浏览器以connect.sid作为cookie的键存储好值，例如上面的：dvJ  |
| Path        | 表示将来访问/下面的所有url时，都要将cookie的值通过请求报文头中的cookies传给数据服务 |
| HttpOnly    | 表示只有在http下的请求才将cookie传给数据服务              |

## 数据服务解决ajax跨域问题
>在数据服务的入口文件 app.js中做如下设置类解决管理后台ajax跨域访问问题

```javascript
nodejs+express 写法：

app.all('/admin/*',(req,res,next)=>{
	//设置允许跨域响应报文头
	//设置跨域
  //设置只有 http://127.0.0.1:5008 下发出的ajax请求才允许访问
	res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5008");

  // 设置允许的请求头
	res.header("Access-Control-Allow-Headers", "X-Requested-With, accept,OPTIONS, content-type");
  // 设置允许的请求方式为所有，即 get,post,put,delete等请求方式均可
	res.header("Access-Control-Allow-Methods","*");

	/* 需要让ajax请求携带cookie ,Access-Control-Allow-Credentials要设置为true，
  那么Access-Control-Allow-Origin不能设置为*，必须设置为请求者所在的域名
   */
	res.header("Access-Control-Allow-Credentials", "true");

  // 统一设置响应给请求者的格式为json格式
	res.setHeader('Content-Type','application/json;charset=utf-8');

    //  如果当前请求时OPTIONS 直接响应回去，不进入真正的业务逻辑方法，防止执行多次而产生
  // 主要是解决axios发出post请求时，可能会额外发出OPTIONS请求，导致执行两次业务，比如
  // 新增了两条数据到数据库里面造成业务紊乱
	if(req.method!="OPTIONS"){
	     next();
  }else{
     res.end('');
  }
});

```



# 账号管理

## 用户登录

>开发者可以通过本接口实现用户的登录检查，本接口如果验证用户名和密码成功，则会在服务器端写个当前浏览器匹配的
>session，同时将cookieid以响应报文头的方式响应给浏览器

***
>http请求方式：POST

>请求url：  /nc/common/account/login

> **此api不需要登录即可访问**

***
>请求报文体传参示例：

教师端账号:18888888888

学生端账号:19999999999

密码均为：123456
```json
{
  "user_name":"18888888888",
  "password":"123456"
}
```

***
>请求参数说明：

| 参数名称      | 参数说明  |
| --------- | ----- |
| user_name | 登录用户名 |
| password  | 登录密码  |

***
>响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": {
        "text": "登录成功",
        "userinfo": {
            "uid": 4,
            "uname": "88888",
            "role": 0,
            "nick_name": "88888"
        }
    }
}
```
***
>响应错误时，数据服务会返回错误码1和错误信息，例如：

```json
{
  "status":1,
  "message":"用户名或者密码错误"
}

```



## 用户退出

>开发者可以通过本接口实现用户的退出登录

***
>http请求方式：GET

>请求url：  /nc/common/account/logout
>
>**此api不需要登录即可访问**

***
>响应正确时的JSON返回结果：

```json
{
  "status":0,
  "message":"用户已注销"
}

```
***
>响应错误时，数据服务会返回错误码1和错误信息，例如：

```json
{
  "status":1,
  "message":"服务器异常信息"
}

```
***



## 检查是否有登录

>开发者可以通过本接口实现检查系统是否有登录，根据登录状态来做相应处理

***
>http请求方式：Get

>请求url：  /nc/common/account/islogin
>
>**此api不需要登录即可访问**

***
>请求参数：无

***

>响应的JSON返回结果：

```json
{
    "status": 0,
    "message": "用户已登录"
}

{
    "status": 2,
    "message": "用户未登录"
}

```

>响应参数说明

| 参数名称   | 参数说明                  |
| ------ | --------------------- |
| status | 表示当前登录状态 0: 已登录，2:未登录 |



## 用户注册

>开发者可以通过本接口实现用户注册

***
>http请求方式：POST

>请求url：  /nc/common/account/register
>
>**此api不需要登录即可访问**

***
>请求报文体传参示例：

```json
{
  "user_name":"13898765432",
  "password":"123",
  "sns_code":"88888",
  "role":"1"
}
```

***
>请求参数说明：

| 参数名称      | 参数说明              |
| --------- | ----------------- |
| user_name | 用户手机号             |
| password  | 密码                |
| sns_code  | 短信验证码             |
| role      | 用户类型，0：普通用户  1：教师 |

***
>响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": {
        "text": "用户注册成功"
    }
}
```
***
>响应错误时，数据服务会返回错误码1和错误信息，例如：

```json
{
  "status":1,
  "message":"数据服务异常信息"
}
```
***



## 检查用户名是否已注册

>开发者可以通过本接口实现检查用户名是否存在，通常用在注册页面中

***
>http请求方式：POST

>请求url： /nc/common/account/checkuser

***
>请求参数：

| 参数名      | 说明      |
| -------- | ------- |
| username | 要检查的用户名 |

***

>响应正确的JSON：

```json
方式1：
{
    "status": 0,
    "message": {
        "text": "用户名已经注册，请更换一个",
      	"isRegister":true      
    }
}

方式2：
{
    "status": 0,
    "message": {
        "text": "用户名可用",
      	"isRegister":false      
    }
}
```



>响应错误时，数据服务会返回错误码1和错误信息，例如：

```json
{
  "status":1,
  "message":"数据服务异常信息"
}
```



## 手机短信验证码

> 开发者可以通过本接口实现给指定手机号码发送短信验证码

------

> http请求方式：POST

> 请求url： /nc/common/account/snscode

------

> 请求参数：

| 参数名      | 说明         |
| -------- | ---------- |
| username | 接收验证码的手机号码 |

------

> 响应正确的JSON：

```json
{
    "status": 0,
    "message": {
        "reason": "操作成功",
        "result": {
            "sid": "c91b55beea8f4b78837d2f9a93d090db",
            "fee": 1,
            "count": 1
        },
        "error_code": 0
    }
}

或者
{
    "status": 0,
    "message": {
        "reason": "短信验证码发送过频繁",
        "result": [],
        "error_code": 205404
    }
}
```



> 响应错误时，数据服务会返回错误码1和错误信息，例如：

```json
{
  "status":1,
  "message":"数据服务异常信息"
}
```



# 首页
## 获取首页顶部 轮播图，分类导航数据

> http请求方式：GET

> 请求url：  /nc/course/home/gettopdata

------

> 请求示例：http://157.122.54.189:9092/nc/course/home/gettopdata

------

> 请求参数：无

------

> 响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": {
        "catelist": [
            {
                "id": 40,
                "pid": 0,
                "class_layer": 1,
                "title": "前端与移动开发",
                "subcates": [
                    {
                        "id": 43,
                        "pid": 40,
                        "class_layer": 2,
                        "title": "免费课",
                        "subcates": [
                            {
                                "id": 52,
                                "pid": 43,
                                "class_layer": 3,
                                "title": "javascript",
                                "subcates": []
                            }
                        ]
                    },
                    {
                        "id": 44,
                        "pid": 40,
                        "class_layer": 2,
                        "title": "提升课",
                        "subcates": [
                            {
                                "id": 59,
                                "pid": 44,
                                "class_layer": 3,
                                "title": "小程序",
                             	"subcates": []
                            }
                        ]
                    }
                ]
            }
        ],
        "sliderlist": [
            {
                "id": 113,
                "title": "6节课掌握Python爬虫",
                "img_url": "http://157.122.54.189:9092/upload/201809/19/201809191145158376.jpg"
            }            
        ]
    }
}
```

> 响应参数说明

| 参数名称       | 参数说明           |
| ---------- | -------------- |
| catelist   | 当前频道中的一级分类数据数组 |
| sliderlist | 轮播图数组          |

------

> 分类数组(catelist)对象参数值说明：

| 参数名         | 说明                |
| ----------- | ----------------- |
| id          | 分类数据id            |
| pid         | 父分类id ,1级分类的pid为0 |
| class_layer | 分类的级别数字           |
| title       | 分类名称              |
| subcates    | 分类下的子级分类          |

> 当前频道轮播图数组(sliderlist)中的对象参数值说明：

| 参数名     | 说明        |
| ------- | --------- |
| id      | 数据id      |
| title   | 标题        |
| img_url | 封面配图完整url |

> 业务调用处：

![p3](/img/p3.png)

## 获取首页精品推荐课程数据

> http请求方式：GET

> 请求url：  /nc/course/home/getTopCourseList

------

> 请求示例：http://157.122.54.189:9092/nc/course/home/getTopCourseList

------

> 请求参数：无

------

> 响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": [
        {
            "category_id_top": 40,
            "category_id": 56,
            "id": 102,
            "title": "【前端】Vue实现移动商城购物网站项目",
          	"sub_title":"Vue+Vuex+vue-resource+webpack技术栈,采取完全前后端分离模式开发",
            "is_hot": 1,
            "img_url": "http://157.122.54.189:9092/upload/201809/17/201809171437171126.jpg",
            "lesson_level": "初级",
            "click": 1209
        }
    ]
}
```

> 响应参数说明

message数组中对象参数说明，message数组最多为10条

| 参数名称            | 参数说明                          |
| --------------- | ----------------------------- |
| category_id_top | 课程所属一级分类                      |
| category_id     | 课程所属分类                        |
| id              | 课程id                          |
| title           | 课程名称                          |
| is_hot          | 是否热门课程，1：热门 0：热门              |
| img_url         | 课程图片                          |
| lesson_level    | 课程等级,固定：1:热门  2：初级  3：中级 4：高级 |
| click           | 学习人数                          |
| sub_title       | 课程简介                          |

------

> 业务调用处：

![p1](/img/p1.png)

![p6](/img/p6.png)



## 获取首页分类课程数据

> http请求方式：GET

> 请求url：  /nc/course/home/getcourselist

------

> 请求示例：http://157.122.54.189:9092/nc/course/home/getcourselist

------

> 请求参数：无

------

> 响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": {
        "types": [
            {
                "tid": 1,
                "title": "热门"
            },
            {
                "tid": 2,
                "title": "初级"
            },
            {
                "tid": 3,
                "title": "中级"
            },
            {
                "tid": 4,
                "title": "高级"
            }
        ],
        "datas": [
            {
                "id": 40,
                "title": "前端与移动开发",
                "img_url": "/upload/qd.png",
                "img1_url": "/upload/python.png",
                "courseList": [
                    {
                        "category_id_top": 40,
                        "id": 102,
                        "title": "【前端】Vue实现移动商城购物网站项目",
                        "img_url": "http://157.122.54.189:9092/upload/201809/17/201809171437171126.jpg",
                        "lesson_level": "初级",
                        "click": 12
                    }
                ]
            },
            {
                "id": 41,
                "title": "Java",
                "img_url": "/upload/com.png",
                "img1_url": "/upload/python1.png",
                "courseList": [
                    {
                        "category_id_top": 41,
                        "id": 106,
                        "title": "【Java基础】Java入门课程",
                        "img_url": "http://157.122.54.189:9092/upload/201809/19/201809191125205879.jpg",
                        "lesson_level": "初级",
                        "click": 4
                    }
                ]
            }
        ]
    }
}
```

> 响应参数说明

| 参数名称  | 参数说明                                  |
| ----- | ------------------------------------- |
| types | 课程首页中的课程类型数据，固定：1:热门  2：初级  3：中级 4：高级 |
| datas | 课程种类和该种类下的课程数据                        |

------

> (datas)中的对象参数值说明：

| 参数名        | 说明                        |
| ---------- | ------------------------- |
| id         | 分类id                      |
| title      | 分类名称                      |
| img_url    | 分类左边图片                    |
| img1_url   | 分类课程上方banner图片            |
| courseList | 该分类下的课程数据数组（默认是热门数据，最多5条） |

> (courseList)中的对象参数值说明：

| 参数名             | 说明       |
| --------------- | -------- |
| category_id_top | 所属顶级分类id |
| id              | 课程数据id   |
| title           | 课程名称     |
| img_url         | 课程图片     |
| lesson_level    | 课程分类文字说明 |
| click           | 学习人数     |



> 业务调用处：

![p2](/img/p2.png)



## 获取首页热门、初、中、高级分类课程

> http请求方式：GET

> 请求url：  /nc/course/home/getcourselistByType/参数1/参数2

------

> 请求示例：http://157.122.54.189:9092/nc/course/home/getcourselistByType/41/1

------

> 请求参数：

| 参数名称 | 说明                                       |
| ---- | ---------------------------------------- |
| 参数1  | 一级分类id                                   |
| 参数2  | 一级分类下的 1：热门 2：初级  3：中级 4：高级这些类型的课程 数据，根据需求传入对应的1,2,3,4其中之一的值 |

------

> 响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": [
        {
            "category_id_top": 41,
            "category_id": 66,
            "id": 109,
            "title": "【Java】职业规划公开课",
            "is_hot": 1,
            "img_url": "http://157.122.54.189:9092/upload/201809/19/201809191135273079.jpg",
            "lesson_level": "初级",
            "click": 2342
        }
    ]
}
```

> 响应参数说明

| 参数名称    | 参数说明             |
| ------- | ---------------- |
| status  | 0:正常 1：异常        |
| message | 课程数据数组，限制最多为5条数据 |

> 业务调用处：

![p4]/img/\p4.png)

# 课程列表页

## 获取列表页上分类数据

> http请求方式：GET

> 请求url： /nc/course/courseList/getCateList

------

> 请求示例：http://157.122.54.189:9092/nc/course/courseList/getCateList

------

> 请求参数：无

------

> 响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": {
        "cate_Top_List": [
           {
                "id": -1,
                "title": "全部",
                "parent_id": -1,
                "class_layer": -1
            },
            {
                "id": 40,
                "title": "前端与移动开发",
                "parent_id": 0,
                "class_layer": 1
            }
        ],
        "cate_Other_List": [
          {
                "id": -1,
                "title": "全部",
                "parent_id": -1,
                "class_layer": -1
            },
            {
                "id": 52,
                "title": "javascript",
                "parent_id": 43,
                "class_layer": 3
            }
        ],
        "course_types": [
         	 {
                "tid": -1,
                "title": "全部"
            },
            {
                "tid": 1,
                "title": "热门"
            },
            {
                "tid": 2,
                "title": "初级"
            },
            {
                "tid": 3,
                "title": "中级"
            },
            {
                "tid": 4,
                "title": "高级"
            }
        ]
    }
}
```

> 响应参数说明

| 参数名称            | 参数说明         |
| --------------- | ------------ |
| status          | 0:正常 1：异常    |
| cate_Top_List   | 一级分类数据       |
| cate_Other_List | 一级分类下的其他分类数据 |
| course_types    | 难度等级         |



> 业务调用处：

![p5/img/g\p5.png)



## 根据分类分页获取课程数据

> http请求方式：GET

> 请求url： /nc/course/courseList/getCourseList?cate_top_id=一级分类id&cate_id=2,3...级分类id&type=课程标签id&pageIndex=页码&pageSize=单页容量

------

> 请求示例：http://157.122.54.189:9092/nc/course/courseList/getCourseList?cate_top_id=-1&cate_id=-1&type=-1&pageIndex=1&pageSize=28

------

> 请求参数：

| 参数名称        | 说明                         |
| ----------- | -------------------------- |
| cate_top_id | 一级分类id                     |
| cate_id     | 2,3...级分类id                |
| type        | 课程标签id，1：热门 2：初级 3：中级 4：高级 |
| pageIndex   | 页码，最小值为1                   |
| pageSize    | 单页容量，默认是10                 |

------

> 响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": [
        {
            "category_id_top": 40,
            "category_id": 59,
            "id": 103,
            "title": "【前端】快应用实战开发 - 快速上手",
            "is_hot": 1,
            "img_url": "http://157.122.54.189:9092/upload/201809/19/201809191054524297.jpg",
            "lesson_level": "中级",
            "click": 4589,
            "sub_title": ""
        }
    ],
    "totalCount": 1,
    "pageIndex": 1,
    "pageSize": 5
}
```

> 响应参数说明

| 参数名称       | 参数说明                           |
| ---------- | ------------------------------ |
| status     | 0:正常 1：异常                      |
| message    | 符合条件的单页课程数据数组对象，对象属性说明，请参考下面表格 |
| totalCount | 符合条件的课程总数量                     |
| pageIndex  | 当前请求的页码                        |
| pageSize   | 当前请求的单页容量                      |



message参数数组对象属性说明：

| 参数名称            | 参数说明              |
| --------------- | ----------------- |
| category_id_top | 课程所属一级分类id        |
| category_id     | 课程所属分类id          |
| id              | 课程id              |
| title           | 课程标题              |
| is_hot          | 1：热门课程 0：非热门课程    |
| img_url         | 课程图片              |
| lesson_level    | 课程难度等级文字，初级，中级，高级 |
| click           | 学习人数              |
| sub_title       | 课程说明              |



> 业务调用处：

![p/img/mg\p7.png)

# 课程详情页

## 根据课程ID获取课程详情数据

> http请求方式：GET

> 请求url： /nc/course/courseDetial/getCourseDetial/参数1

------

> 请求示例：http://157.122.54.189:9092/nc/course/courseDetial/getCourseDetial/102

------

> 请求参数：

| 参数名称 | 说明    |
| ---- | ----- |
| 参数1  | 课程id值 |

------

> 响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": {
        "BreadCrumbs": [
            {
                "id": 40,
                "title": "前端与移动开发"
            },
            {
                "id": 44,
                "title": "提升课"
            },
            {
                "id": 59,
                "title": "小程序"
            }
        ],
        "CourseDetial": {
            "id":102,
            "title": "【前端】Vue实现移动商城购物网站项目",
            "sub_title": "Vue+Vuex+vue-resource+webpack技术栈",
            "sell_price": 399,
            "market_price": 899,
            "lesson_level": "初级",
            "lesson_time": 0,
            "click": 1209,
            "lesson_star": 5,
            "leson_type": "录播模式",
            "content": "<p><img src=\"http://157.122.54.189:9092/upload/201809/17/201809171445581503.png\" title=\"vuedesc.png\" alt=\"vuedesc.png\" width=\"820\" height=\"4949\"/></p>",
            "common_question": "<p><span style=\"color: rgb(0, 112, 192);\"><strong>1、Vue 是什么？</strong>",
            "teacher_img": "http://157.122.54.189:9092/upload/teacherimg.jpg",
            "teacher_name": "黑马高级讲师",
            "teacher_desc": "计算机硕士，专注于IT编程领域20年，猎涉多门编程语言，参与多个国家级计算机项目，多年培训经验，丰富的教学讲解经验"
        }
    }
}
```

> 响应参数说明

| 参数名称               | 参数说明              |
| ------------------ | ----------------- |
| BreadCrumbs        | 课程详情页面中的面包屑导航数据   |
| BreadCrumbs业务调用处：  | ![/img/img\p8.png) |
| CourseDetial       | 课程详情，课程常见问题数据     |
| CourseDetial业务调用处： | !/img/(img\p9.png) |



> CourseDetial对象说明

| 参数名称            | 说明             |
| --------------- | -------------- |
| id              | 课程id           |
| title           | 课程名称           |
| sub_title       | 课程简要描述         |
| sell_price      | 销售价格           |
| market_price    | 市场价格           |
| lesson_level    | 课程难度等级         |
| lesson_time     | 课程视频时长，单位：分钟   |
| lesson_star     | 课程评分，1-5分      |
| leson_type      | 课程授课模式         |
| click           | 该课程学习人数        |
| content         | 课程详细介绍（富文本字符串） |
| common_question | 课程常见问题（富文本字符串） |
| teacher_img     | 课程讲解老师头像       |
| teacher_name    | 课程讲解老师名称       |
| teacher_desc    | 课程讲解老师介绍       |



## 根据课程ID获取课程大纲数据

> http请求方式：GET

> 请求url： /nc/course/courseDetial/getOutline/参数1

------

> 请求示例：http://157.122.54.189:9092/nc/course/courseDetial/getOutline/102

------

> 请求参数：

| 参数名称 | 说明       |
| ---- | -------- |
| 参数1  | 传入课程课程id |

------

> 响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": [
        {
            "id": 2,
            "goods_id": 102,
            "parent_id": 0,
            "section_sortid": 1,
            "section_name": "第一章：Vue基础",
            "is_free": 1,
            "video_time": 13.5            
        },
        {
            "id": 3,
            "goods_id": 102,
            "parent_id": 2,
            "section_sortid": 1,
            "section_name": "1-vue指令",
            "is_free": 1,
            "video_time": 8.5
        }
    ]
}
```

> 响应参数说明

| 参数名称    | 参数说明                             |
| ------- | -------------------------------- |
| status  | 0:正常 1：异常                        |
| message | 当前课程大纲数组，调用处：!/img/](img\p10.png) |



> message数组中对象属性说明

| 参数名称           | 说明                                      |
| -------------- | --------------------------------------- |
| id             | 课程章节/小节id                               |
| goods_id       | 所属课程                                    |
| parent_id      | 父id                                     |
| section_sortid | 章节/小节排序id，每一级都是从1开始计数                   |
| section_name   | 章节/小节名称                                 |
| is_free        | 1：该章节免费试学   0：收费                        |
| video_time     | 小节视频长度，单位：分钟                            |
| video_path     | 章节视频地址，如果为空则表示是该数据为1级章节，只有章节下面的小节才有视频地址 |

  

## 根据小节ID获取该小节详细数据

> http请求方式：GET

> 请求url： /nc/course/courseDetial/getSectionInfo/参数1

------

> 请求示例：http://157.122.54.189:9092/nc/course/courseDetial/getSectionInfo/3

------

> 请求参数：

| 参数名称 | 说明           |
| ---- | ------------ |
| 参数1  | 传入课程大纲的某小节id |

------

> 响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": {
        "id": 3,
        "goods_id": 102,
        "section_name": "1-vue指令",
        "is_free": 1,
        "video_path": "http://157.122.54.189:9092/upload/201809/19/201809191620139216.mp4",
        "video_time": 8.5,
        "code_path": "http://157.122.54.189:9092/upload/201809/19/testvuecli.rar",
        "notes_path": "http://157.122.54.189:9092/upload/201809/19/jy.rar"
    }
}
```

> 响应参数说明

| 参数名称    | 参数说明      |
| ------- | --------- |
| status  | 0:正常 1：异常 |
| message | 当前小节相关数据  |



> message数组中对象属性说明

| 参数名称         | 说明               |
| ------------ | ---------------- |
| id           | 课程章节id           |
| goods_id     | 所属课程             |
| section_name | 章节名称             |
| is_free      | 1：该章节免费试学   0：收费 |
| video_time   | 章节视频长度，单位：分钟     |
| video_path   | 视频播放地址           |
| code_path    | 章节代码文件下载地址       |
| notes_path   | 章节讲义文件下载地址       |

>   业务调用：

/img/1](img\p11.png)



## 根据小节ID分页获取该小节下所有的问答数据

> http请求方式：GET

> 是否需要登录才能访问：否

> 请求url： /nc/course/courseDetial/getSectionQAByPage/参数1?pageIndex=分页索引&pageSize=单页容量

------

> 请求示例：http://157.122.54.189:9092/nc/course/courseDetial/getSectionQAByPage/3?pageIndex=2&pageSize=2

------

> 请求参数：

| 参数名称      | 说明           |
| --------- | ------------ |
| 参数1       | 传入课程大纲的某小节id |
| pageIndex | 分页索引         |
| pageSize  | 单页容量         |

------

> 响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": [
        {
            "id": 1,
            "parent_id": 0,
            "section_id": 3,
            "user_id": 12,
            "user_name": "188888888888",
            "user_ip": null,
            "content": "Vue1.0和Vue2.0的区别有哪些",
            "add_time": "2018-10-12T04:37:35.000Z",
            "is_reply": 1,
            "reply_count": 1,
            "replyList": [
                {
                    "id": 2,
                    "section_id": 3,
                    "parent_id": 1,
                    "user_id": 13,
                    "user_name": "19999999",
                    "user_ip": null,
                    "content": "",
                    "add_time": "2018-10-12T04:37:35.000Z",
                    "is_reply": 0,
                    "reply_count": null
                }
            ]
        }
    ],
    "totalCount": 5,
    "pageIndex": 2,
    "pageSize": 2
}
```

> 响应参数说明

| 参数名称          | 参数说明                      |
| ------------- | ------------------------- |
| id            | 问题数据id                    |
| parent_id     | 0：代表是问题  1：代表是回答这个问题的回复内容 |
| section_id    | 小节id                      |
| user_id       | 问题发布人id                   |
| user_name     | 问题发布人名称                   |
| user_ip       | 问题发布人ip                   |
| content       | 问题详细描述                    |
| add_time      | 问题发布时间                    |
| is_reply      | 1：问题已回复  0：问题未回复          |
| reply_content | 问题回复内容                    |
| reply_count   | 问题回复的条数                   |
| replyList     | 当前问题回复内容数组                |
| totalCount    | 数据总条数，可以用来计算分页总数          |
| pageIndex     | 当前请求的页索引                  |
| pageSize      | 当前请求的单页容量，可以用来计算分页总数      |

> 业务调用处：
/img/12](img\p12.png)

## 提交小节问题数据(需登录)

> http请求方式：POST

> 是否需要登录才能访问：是

> 请求url： /ch/course/courseDetial/PostSectionQuestion

------

> 请求示例：http://157.122.54.189:9092/ch/course/courseDetial/PostSectionQuestion

------

> 请求参数：

| 参数名称       | 说明             |
| ---------- | -------------- |
| section_id | 小节id           |
| content    | 问题详细描述（富文本字符串） |

------

> 响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": "问题提交成功"        
}
```

> 响应参数说明

| 参数名称    | 参数说明          |
| ------- | ------------- |
| status  | 返回状态码，见文档顶部说明 |
| message | 服务器处理信息       |

> 业务调用处：视频播放页面下的问题列表中
/img/14](img\p14.png)



## 回复小节问题数据(需登录)

> http请求方式：POST

> 是否需要登录才能访问：是

> 请求url： /ch/course/courseDetial/PostSectionResult

------

> 请求示例：http://157.122.54.189:9092/ch/course/courseDetial/PostSectionResult

------

> 请求参数：

| 参数名称       | 说明                      |
| ---------- | ----------------------- |
| section_id | 小节id                    |
| parent_id  | 回复的问题数据id（代表当前回复的是哪个问题） |
| content    | 回复内容（富文本字符串）            |

------

> 响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": "回复问题成功"
}
```

> 响应参数说明

| 参数名称    | 参数说明          |
| ------- | ------------- |
| status  | 返回状态码，见文档顶部说明 |
| message | 服务器处理信息       |

> 业务调用处：点击视频播放页面下的问题列表数据中的回复按钮
/img/14](img\p14.png)



## 根据小节ID分页获取该小节下当前用户的笔记数据(需登录)

> http请求方式：GET

> 是否需要登录才能访问：是  , 请使用 18888888888 ( 密码：123456) 这个用户登录才有笔记数据

> 请求url： /ch/course/courseDetial/getSectionNotesByPage/参数1?pageIndex=分页索引&pageSize=单页容量

------

> 请求示例：http://157.122.54.189:9092/ch/course/courseDetial/getSectionQAByPage/3?pageIndex=1&pageSize=2

------

> 请求参数：

| 参数名称      | 说明           |
| --------- | ------------ |
| 参数1       | 传入课程大纲的某小节id |
| pageIndex | 分页索引         |
| pageSize  | 单页容量         |

------

> 响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": [
        {
            "id": 3,
            "section_id": 3,
            "user_id": 12,
            "user_name": "1888888",
            "user_ip": null,
            "notes_content": "<p><span style=\"color: rgb(0, 112, 192);\"><strong>1、Vue 是什么？</strong>",
            "add_time": null
        }
    ],
    "totalCount": 3,
    "pageIndex": 1,
    "pageSize": 2
}
```

> 响应参数说明

| 参数名称          | 参数说明                  |
| ------------- | --------------------- |
| id            | 笔记数据id                |
| section_id    | 小节id                  |
| user_id       | 笔记发布人id               |
| user_name     | 笔记发布人名称               |
| user_ip       | 笔记发布人ip               |
| notes_content | 笔记详细描述                |
| add_time      | 发布时间                  |
| totalCount    | 符合条件的数据总条数，可以用来计算分页总数 |
| pageIndex     | 当前请求的页索引              |
| pageSize      | 当前请求的单页容量,可以用来计算分页总数  |

> 业务调用处：
/img/13](img\p13.png)

## 提交小节笔记数据(需登录)

> http请求方式：POST

> 是否需要登录才能访问：是

> 请求url： /ch/course/courseDetial/PostNotes

------

> 请求示例：http://157.122.54.189:9092/ch/course/courseDetial/PostNotes

------

> 请求参数：

| 参数名称       | 说明           |
| ---------- | ------------ |
| section_id | 小节id         |
| content    | 笔记内容（富文本字符串） |

------

> 响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": "提交笔记成功"
}
```

> 响应参数说明

| 参数名称    | 参数说明          |
| ------- | ------------- |
| status  | 返回状态码，见文档顶部说明 |
| message | 服务器处理信息       |

> 业务调用处：视频播放页面下的笔记列表中
/img/14](img\p14.png)



# 课程购买

## 加入购物车(需登录)

> http请求方式：POST

> 是否需要登录才能访问：是

> 请求url： /ch/shop/postshopcar

------

> 请求示例：http://157.122.54.189:9092/ch/shop/postshopcar

------

> 请求参数：

| 参数名称     | 说明              |
| -------- | --------------- |
| goods_id | 商品id（测试可以使用102） |

------

> 响应JSON返回结果：

```json
情况1：如果商品已经存在于当前用户购物车中，则无需重复添加
{  
    "status": 1,
    "message": "该商品已经存在于购物车，无需重复添加"
}

正常情况：
{  
    "status": 0,
    "message": "商品已加入购物车"
}
```

> 响应参数说明

| 参数名称    | 参数说明          |
| ------- | ------------- |
| status  | 返回状态码，见文档顶部说明 |
| message | 服务器处理信息       |

> 业务调用处：点击加入购物车按钮
/img/15](img\p15.png)



## 用户购物车列表数据获取(需登录)

> http请求方式：GET

> 是否需要登录才能访问：是

> 请求url： /ch/shop/getshopcarlist

------

> 请求示例：http://157.122.54.189:9092/ch/shop/getshopcarlist

------

> 请求参数：无

------

> 响应JSON返回结果：

```json
{
    "status": 0,
    "message": [
        {
            "shop_car_id": 1,
            "goods_id": 102,
            "title": "【前端】Vue实现移动商城购物网站项目",
            "timeout": 12,
            "sell_price": 399,
            "img_url": "http://157.122.54.189:9092/upload/201809/17/201809171437171126.jpg"
        }
    ]
}
```

> 响应参数说明

| 参数名称        | 参数说明        |
| ----------- | ----------- |
| shop_car_id | 购物车数据id值    |
| goods_id    | 课程id        |
| title       | 课程名称        |
| timeout     | 课程服务周期，单位：月 |
| sell_price  | 课程价格        |
| img_url     | 课程图片        |

> 业务调用处：购物车列表
/img/16](img\p16.png)



## 删除用户购物车指定课程数据(需登录)

> http请求方式：GET

> 是否需要登录才能访问：是

> 请求url： /ch/shop/deleteshopcar/参数1

------

> 请求示例：http://157.122.54.189:9092/ch/shop/deleteshopcar/103

------

> 请求参数：

| 参数名称 | 说明   |
| ---- | ---- |
| 参数1  | 商品id |

------

> 响应JSON返回结果：

```json
{  
    "status": 0,
    "message": "商品数据删除成功"
}
```

> 响应参数说明

| 参数名称    | 参数说明          |
| ------- | ------------- |
| status  | 返回状态码，见文档顶部说明 |
| message | 服务器处理信息       |

> 业务调用处：点击购物车列表中的删除按钮
/img/16](img\p16.png)



## 下单操作(需登录)

> http请求方式：POST

> 是否需要登录才能访问：是

> 请求url： /ch/shop/postOrder

------

> 请求示例：http://157.122.54.189:9092/ch/shop/postshopcar

------

> 请求参数：

| 参数名称       | 说明                                   |
| ---------- | ------------------------------------ |
| amount     | 订单总金额                                |
| payment_id | 支付方式，1: 微信支付  2：支付宝支付                |
| goodsIds   | 订单购买的课程id字符串，多个课程id之间使用逗号隔开，例如：1,2,3 |

------

> 响应JSON返回结果：

```json
{
    "status": 0,
    "message": {
        "order_id": 21,
        "order_no": "BD2018101301829505",
        "amount": "398",
        "remark": "【前端】Vue实现移动商城购物网站项目   原价：￥399 <br /> 【前端】快应用实战开发 - 快速上手   原价：￥0 <br /> "
    }
}
```

> 响应参数说明

| 参数名称     | 参数说明  |
| -------- | ----- |
| order_id | 订单id值 |
| order_no | 订单号   |
| amount   | 订单总金额 |
| remark   | 订单描述  |

> 业务调用处：提交订单 按钮
/img/17](img\p17.png)

> 确认订单
/img/18](img\p18.png)

点击“确认支付”按钮后进入：
/img/19](img\p19.png)

# 支付成功后更新订单(由支付平台调用，无需登录)



# 个人中心

## 获取我的订单列表(需登录)

> http请求方式：GET

> 请求url：/ch/mycenter/getMyOrderListByPage/参数1?pageIndex=页码&pageSize=单页容量

------

> 请求示例：http://157.122.54.189:9092/ch/mycenter/getMyOrderListByPage/-1?pageIndex=1&pageSize=10

 	注意：在没有下单的情况下，请求示例可以使用 用户： 18888888888 密码：123456 登录后获取已有数据

------

> 请求参数：

| 参数名称      | 说明                                       |
| --------- | ---------------------------------------- |
| 参数1       | 订单分类，-1:全部订单  0：待付款 1：已完成 2：已取消 （数据来源于此接口中的OrderTypeList） |
| pageIndex | 页码，最小值为1                                 |
| pageSize  | 单页容量，默认是10                               |

------

> 响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": {
        "OrderTypeList": [
            {
                "id": -1,
                "title": "全部订单"
            },
            {
                "id": 0,
                "title": "待付款"
            },
            {
                "id": 1,
                "title": "已完成"
            },
            {
                "id": 2,
                "title": "已取消"
            }
        ],
        "orderList": [
            {
                "id": 21,
                "order_no": "BD2018101301829505",
                "add_time": "2018-10-12T16:18:29.000Z",
                "payable_amount": 398,
                "real_amount": 0,
                "status": 0,
                "statusName": "待付款",
                "order_goods_list": [
                    {
                        "id": 15,
                        "order_id": 21,
                        "goods_id": 102,
                        "goods_title": "【前端】Vue实现移动商城购物网站项目",
                        "timeout_time": "2019-10-12T16:18:29.000Z",
                        "lesson_star": 5,
                        "img_url": "http://157.122.54.189:9092/upload/201809/17/201809171437171126.jpg"
                    },
                    {
                        "id": 16,
                        "order_id": 21,
                        "goods_id": 103,
                        "goods_title": "【前端】快应用实战开发 - 快速上手",
                        "timeout_time": "2019-10-12T16:18:29.000Z",
                        "lesson_star": 5,
                        "img_url": "http://157.122.54.189:9092/upload/201809/19/201809191054524297.jpg"
                    }
                ]
            }
        ]
    },
    "totalCount": 2,
    "pageIndex": 1,
    "pageSize": 10
}
```

> 响应参数说明

| 参数名称       | 参数说明                           |
| ---------- | ------------------------------ |
| status     | 0:正常 1：异常                      |
| message    | 符合条件的单页课程数据数组对象，对象属性说明，请参考下面表格 |
| totalCount | 符合条件的课程总数量                     |
| pageIndex  | 当前请求的页码                        |
| pageSize   | 当前请求的单页容量                      |



message.OrderTypeList参数数组对象属性说明：获取订单页面上的订单筛选条件

| 参数名称  | 参数说明                            |
| ----- | ------------------------------- |
| id    | 类别id，-1:全部订单  0：待付款 1：已完成 2：已取消 |
| title | 类别名称                            |



message.orderList参数数组对象属性说明：

| 参数名称             | 参数说明                   |
| ---------------- | ---------------------- |
| id               | 订单数据id                 |
| order_no         | 订单号                    |
| add_time         | 下单时间                   |
| payable_amount   | 订单总金额                  |
| real_amount      | 实际支付金额                 |
| status           | 订单状态 0：待付款 1：已完成 2：已取消 |
| statusName       | 订单状态名称                 |
| order_goods_list | 一个数组，存储当前订单所购买的课程数据对象  |

message.orderList.order_goods_list参数数组对象属性说明

| 参数名称         | 参数说明                           |
| ------------ | ------------------------------ |
| id           | 编号                             |
| order_id     | 课程所属订单                         |
| goods_id     | 课程编号                           |
| goods_title  | 课程名称                           |
| timeout_time | 当前订单所购该课程的到期时间，该课程的开始时间为订单下单时间 |
| lesson_star  | 课程评分                           |
| img_url      | 课程图片                           |

> 业务调用处：
/img/20](img\p20.png)

## 获取我的课程列表(需登录)

> http请求方式：GET

> 是否需要登录才能访问：是

> 请求url： /ch/mycenter/getMyCourseList

------

> 请求示例：http://157.122.54.189:9092/ch/mycenter/getMyCourseList

------

> 请求参数：无

------

> 响应JSON返回结果：

```json
{
    "status": 0,
    "message": {
        "currentCourse": {
            "order_id": 20,
            "goods_id": 103,
            "goods_title": "【前端】快应用实战开发 - 快速上手",
            "last_section": 28,
            "last_section_name": "第一章：快应用基础",
            "begin_time": "2018-10-12T16:17:09.000Z",
            "end_time": "2019-10-12T16:17:09.000Z",
            "complate_percent": 0,
            "update_time": "2018-10-12T16:17:09.000Z",
            "update_timestamp": 1539361029000
        },
        "CourseList": [
            {
                "order_id": 20,
                "goods_id": 103,
                "goods_title": "【前端】快应用实战开发 - 快速上手",
                "last_section": 28,
                "last_section_name": "第一章：快应用基础",
                "begin_time": "2018-10-12T16:17:09.000Z",
                "end_time": "2019-10-12T16:17:09.000Z",
                "complate_percent": 0,
                "update_time": "2018-10-12T16:17:09.000Z",
                "update_timestamp": 1539361029000
            },
            {
                "order_id": 20,
                "goods_id": 102,
                "goods_title": "【前端】Vue实现移动商城购物网站项目",
                "last_section": 2,
                "last_section_name": "第一章：Vue基础",
                "begin_time": "2018-10-12T16:17:09.000Z",
                "end_time": "2019-10-12T16:17:09.000Z",
                "complate_percent": 0,
                "update_time": "2018-10-11T16:17:09.000Z",
                "update_timestamp": 1539274629000
            }
        ]
    }
}
```

> 响应参数说明

currentCourse：代表最近学习课程对象

CourseList：所有课程对象数组

| 参数名称              | 参数说明                                     |
| ----------------- | ---------------------------------------- |
| order_id          | 订单id                                     |
| goods_id          | 课程id                                     |
| goods_title       | 课程标题                                     |
| last_section      | 学习课程的小节id （用户点击小节播放的时候要调用api：/ch/mycenter/updateGoodsSection/课程小节id/课程小节名称更新） |
| last_section_name | 学习课程的小节名称（用户点击小节播放的时候要调用api：/ch/mycenter/updateGoodsSection/课程小节id/课程小节名称更新） |
| begin_time        | 课程开始日期                                   |
| end_time          | 课程失效期日期                                  |
| complate_percent  | 当前学习完成百分比                                |
| update_time       | 最新学习时间（用户点击小节播放的时候要调用api：/ch/mycenter/updateGoodsSection/课程小节id/课程小节名称更新） |

> 业务调用处：
/img/21](img\p21.png)



## 个人设置页面(需登录)

暂时不做



# 其他辅助API

## 更新dt_order_goods中的章节，update_time，学习百分比

> http请求方式：POST

> 是否需要登录才能访问：是

> 请求url： /ch/mycenter/updateGoodsSection

> 接口作用：主要是为了个人中心我的课程中的（最近课程，观看百分比，当前进度章节数据更新）
/img/23](img\p23.png)

------

> 请求示例：http://157.122.54.189:9092/ch/mycenter/updateGoodsSection

------

> 请求参数：

| 参数名称         | 说明   |
| ------------ | ---- |
| goods_id     | 课程id |
| section_id   | 章节id |
| section_name | 章节名称 |

------

> 响应正确时的JSON返回结果：

```json
{
    "status": 0,
    "message": "更新我的课程数据成功"
}
```

> 响应参数说明

| 参数名称    | 参数说明          |
| ------- | ------------- |
| status  | 返回状态码，见文档顶部说明 |
| message | 服务器处理信息       |

> 接口调用处：在点击章节播放视频的时候，同步调用此接口进行相关数据更新
/img/22](/img/p22.png)