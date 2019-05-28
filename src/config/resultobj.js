 let successCode = 0 // 表示成功
 let failCode = 1 // 表示失败
 let noLoginCode = 2 // 表示未登录

 let result = {
    status:successCode,
    message:'成功',
    totalCount:0,  // 默认总条数是0
    pageIndex: 1,  // 默认显示第一页
    pageSize: 10  //默认显示10条
 };


// 成功带分页
 function successByPage(obj,totalCount,pageIndex,pageSize) {
  result.status = successCode;
    result.message = obj || '成功';
    result.totalCount = totalCount || 0;
    result.pageIndex = pageIndex || 1;
    result.pageSize = pageSize || 10;
 }

 // 成功不带分页
 function success(obj,text) {
  result.status = successCode;
   result.message = obj || '成功';
   delete result.totalCount;
   delete result.pageIndex;
   delete  result.pageSize;
 }

 // 失败
 function fail(obj) {
    result.status = failCode;
    result.message = obj || '服务器异常';
    delete result.totalCount;
    delete result.pageIndex;
    delete  result.pageSize;
 }

  // 未登录
  function noLogin(obj) {
    result.status = noLoginCode;
    result.message = obj || '登录已经过期';
    delete result.totalCount;
    delete result.pageIndex;
    delete  result.pageSize;
 }

 module.exports =  {
    successCode:successCode,
    failCode:failCode,
    noLoginCode:noLoginCode,
    successByPage,
    success,
    fail,
    noLogin,
    result:result
}