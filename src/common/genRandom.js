//产生不重复的随机数
// 其中num是要生成随机数的个数，min,max一般是0和9
exports.createRandom = (num) =>
{ 
    // 丢弃小数部分,保留整数部分
   return parseInt(Math.random() * 1000000);
}