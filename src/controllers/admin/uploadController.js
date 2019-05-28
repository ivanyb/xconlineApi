var config = require('../../config/config.js');
var commonProcess = require('../../common/commonProcess.js');
var resuleobj = require('../../config/resultobj.js');
var kits = require('../../common/kits.js');
const multiparty = require('multiparty');
const syspath = require('path');
const urlobj = require('url');

// 2 上传图片
exports.uploadimg = (req,res)=>{
	// 初始化文件解析对象
	let form = new multiparty.Form();
	form.uploadDir  = './public/upload/imgs'; //设置文件保存的相对路径
	// form.maxFilesSize = 1024 * 500; //最大只能上传500K

	form.parse(req,(err, fields, files)=>{

        //   console.dir(files);

       
		/*
		{ file:
		   [ { fieldName: 'file',
		       originalFilename: 'Web.png',
		       path: 'public\\upload\\imgs\\-_zChYuXflE6tCfrx9T-ea7C.png',
		       headers: [Object],
		       size: 45108 } 
		    ]
		}
		 */
         if(err){
            resuleobj.fail('图片上传出错:'+err.message);
            res.json(resuleobj.result);	
            return;
         }

         if(!files || files.length <=0){
            resuleobj.fail('没有获取到文件对象，请选择一张图片');
            res.json(resuleobj.result);
            return;	
         }         

		let resArr = [];
        let fileArr = files.null?files.null:files.file;

		for (let i = 0; i < fileArr.length; i++) {
			let item = fileArr[i];
			let path = item.path.replace(/public\\/g,'').replace(/\\\/g/,'/');
            let resObj={name:item.originalFilename,url:urlobj.resolve(config.imgDomain,path)
                ,img_url:urlobj.resolve('/',path)};
            resArr.push(resObj);            			
        };
        // 返回
        resuleobj.success(resArr);
        res.json(resuleobj.result);	
	}); 
}



// 3 上传附件
exports.uploadfile = (req,res)=>{
	// 初始化文件解析对象
	let form = new multiparty.Form();
	form.uploadDir  = './public/upload/attaches'; //设置文件保存的相对路径
	// form.maxFilesSize = 1024 * 500; //最大只能上传500K

	form.parse(req,(err, fields, files)=>{		
		/*
		{ file:
		   [ { fieldName: 'file',
		       originalFilename: 'Web.zip',
		       path: 'public\\upload\\attaches\\-_zChYuXflE6tCfrx9T-ea7C.zip',
		       headers: [Object],
		       size: 45108 } 
		    ]
		}
		 */
        if(err){
            resuleobj.fail('附件上传出错:'+err.message);
            res.json(resuleobj.result);	
            return;
         }

         if(!files || files.length <=0){
            resuleobj.fail('没有获取到文件对象，请选择一个附件');
            res.json(resuleobj.result);
            return;	
         }      
        
		let resArr = [];
        let resObj={};
        let fileArr = files.null?files.null:files.file;

		for (let i = 0; i < fileArr.length; i++) {
			let item = fileArr[i];
			let path = item.path.replace(/public\\/g,'').replace(/\\\/g/,'/');
            resObj={name:item.originalFilename,url:urlobj.resolve(config.imgDomain,path)
                ,path:urlobj.resolve('/',path),size:item.size};
            resArr.push(resObj);            
		};
        
         // 返回
         resuleobj.success(resArr);
         res.json(resuleobj.result);
	}); 
}