var express = require('express');

var Router = express.Router();

const accountCtrl = require('../controllers/accountController.js');

Router.post('/login',accountCtrl.login);
Router.get('/logout',accountCtrl.logout);
Router.get('/islogin',accountCtrl.islogin);
Router.post('/register',accountCtrl.register);
Router.post('/checkuser',accountCtrl.checkuser);
Router.post('/snscode',accountCtrl.snscode);

Router.get('/home',(req,res)=>{
    res.json(req.session.admin_user || {text:'空'});
});
module.exports = Router;