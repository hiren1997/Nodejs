const express = require('express');
const route = express.Router();
const controller = require('../Controller/index');;
const {verifyToken} = require('../middleware/Auth');
const {upload} = require('../Upload/Upload');

route.post('/signup', controller.loginUser);
route.post('/uploadImage', upload.single('image'), controller.uploadImage);
route.post('/updateFormDataById/id=:_id', upload.single('image'),  controller.updateFormData);
route.post('/deleteFormDataById/id=:_id', controller.deleteFormData);
route.post('/email',  controller.emailSend);

route.use(verifyToken);
route.get('/getListData', controller.getListData);
route.post('/createUser', controller.createUser);
route.get('/getUserbyid', controller.getUserbyid); // directly get id from the parameters as key value pair
// route.get('/getUserbyid/id=:_id', controller.getUserbyid); // add in URL
route.post('/updateUser/id=:_id',  controller.updateUser);
route.post('/deleteUser/id=:_id', controller.deleteUser);

module.exports = route;