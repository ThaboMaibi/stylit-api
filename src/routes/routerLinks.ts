const express = require('express')
const router =express.Router()
const userController = require('../controllers/userController')
const adminDashboardController = require('../controllers/adminDashboardController')
const articlesController = require('../controllers/articlesContoller')
const subscriptionsController = require('../controllers/subscriptionController')
const metricsController = require('../controllers/metricsControllers')
const notificationsController = require('../controllers/notificationsController')
const publisherDashboardController = require('../controllers/publisherDashboard')
const advancerDashboardController = require('../controllers/advancerDashboardController')
const landingPageController = require('../controllers/landingPageController')
const protect = require('../middleware/authMiddleware')
var multer = require('multer');

var upload = multer();
export{}

//all users endpoints
router.post('/user/login',userController.logIn)
router.post('/user/register',userController.register)
router.post('/user/forgotPassword',userController.forgotPassword)
router.put('/user/resetPassword',userController.resetPassword)
router.post('/user/googleAuth',userController.authenticateGoogleUser)
router.post('/user/GetGoogleTokens',userController.GetGoogleTokens)
router.post('/user/GetGoogleCredentials',userController.GetGoogleCredentials)
router.post('/user/registerPublisher',protect.protect,userController.registerPublisher)
router.put('/user/updatePassword/:id',protect.protect,userController.updatePassword)
router.get('/user/getMedia/:container/:id',protect.protect,userController.getUploadedMedia)
router.delete('/user/deleteUploadedMedia/:container/:filename/:id',protect.protect,userController.deleteUploadedMedia)
router.put('/user/updateUploadedMedia/:container/:filename/:id',protect.protect,upload.single('file'),userController.updateUploadedMedia)
router.post('/user/sendDeleteAccountToken',protect.protect,userController.sendDeleteAccountToken)
router.delete('/user/deleteAccount',protect.protect,userController.deleteAccount)
router.put('/user/deactivateAccount/:id',protect.protect,userController.deactivateAccount) 


// all users endpoints
router.get('/',userController.welcome)

module.exports = router;