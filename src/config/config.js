
module.exports = {
    // jwt加密（整个系统已不使用jwt，改用session维持状态了）
    jwtslat:'xczx',
    // 当前api所运行的服务器
    imgDomain:'http://157.122.54.189:9092',
	//imgDomain:'http://127.0.0.1:9092',
    // 定义每个课程下面的热门，初级，中级，高级分类数据
    /*
       {id:5,title:'置顶'},
       {id:6,title:'轮播'} 在/nc/admin/getCourseTypes 中增加
    */ 
    courseTypes:[
        {tid:1,title:'热门'},
        {tid:2,title:'初级'},
        {tid:3,title:'中级'},
        {tid:4,title:'高级'}
    ],
    // 支付方式列表
    paymentList:[
        {id:1,title:'微信支付'},
        {id:2,title:'支付宝支付'}
    ],
    // 支付状态列表
    orderStatus:[
        {id:0,title:'待付款'},
        {id:1,title:'已完成'},
        {id:2,title:'已取消'}
    ]
}