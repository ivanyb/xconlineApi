
var resuleobj = require('../config/resultobj.js')

exports.execSqlCallBack = (req, res, sql, callback) => {

    req.db.driver.execQuery(sql, (err, datas) => {
        if (err) {
            callback(err,null);
            return;
        }

        try {
            // 成功
            callback(null,datas);
        }
        catch (e) {
            resuleobj.fail(e.message);
            res.json(resuleobj.result);
        }
    });
}


exports.execQueryCount = (req,res,sql,callback) => {
	let pageIndex = 1;
    let pageSize = 10;
    let totalCount = 0;

	if(req.query.pageIndex){
		pageIndex = parseInt(req.query.pageIndex);
	}
	if(req.query.pageSize){
		pageSize = parseInt(req.query.pageSize);
	}

	if(isNaN(req.query.pageIndex) || isNaN(req.query.pageSize)){
		// resobj.status = ERRORCODE;
		// resobj.message = '参数错误：分页参数pageIndex和pageSize必须是数字';
		// res.end(JSON.stringify(resobj));
        // return;
        resuleobj.fail('参数错误：分页参数pageIndex和pageSize必须是数字');
        res.json(resuleobj.result);
        return;
	}

	let skipCount = (pageIndex - 1) * (pageSize - 0);
	req.db.driver.execQuery(sql,(err,datas)=>{	
			if(err){
                resuleobj.fail('数据总条数sql执行异常：'+err.message);
                res.json(resuleobj.result);
				return;
			}
			try{
					//获取数据总条数
					totalCount = datas[0]?datas[0].count:0;
					
					//回调继续处理其他业务
					callback({pageIndex,pageSize,totalCount,skipCount});
				}
            catch(e){
                    resuleobj.fail('分页数据数据总条数回调异常：'+e.message);
                    res.json(resuleobj.result);
                    }

		});
}

exports.getClientIp = (req) => {
    return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
}

