var express = require('express');

var Router = express.Router();

const ctrl = require('../../controllers/site/courseDetialController.js');

// 根据课程id获取课程详情 和授课老师信息，不包括大纲目录和常见问题
Router.get('/nc/course/courseDetial/getCourseDetial/:id',ctrl.getCourseDetial);

// 获取大纲目录
Router.get('/nc/course/courseDetial/getOutline/:id',ctrl.getOutline);

// 根据小节id获取该小节详细数据，包括该小节的视频播放路径，资源下载路径(/nc 开头表示 不需要登录可以访问)
Router.get('/nc/course/courseDetial/getSectionInfo/:sectionid',ctrl.getSectionInfo);

// 根据小节id分页获取问答数据(/nc 开头表示 不需要登录可以访问)
Router.get('/nc/course/courseDetial/getSectionQAByPage/:sectionid',ctrl.getSectionQAByPage);

// 问题数据提交
Router.post('/ch/course/courseDetial/PostSectionQuestion',ctrl.PostSectionQuestion);

// 问题回复数据提交
Router.post('/ch/course/courseDetial/PostSectionResult',ctrl.PostSectionResult);

// 根据小节id分页获取笔记数据(/ch 开头表示 需要登录才可以访问)
Router.get('/ch/course/courseDetial/getSectionNotesByPage/:sectionid',ctrl.getSectionNotesByPage);

// 笔记提交(/ch 开头表示 需要登录才可以访问)
Router.post('/ch/course/courseDetial/PostNotes',ctrl.PostNotes);


module.exports = Router;