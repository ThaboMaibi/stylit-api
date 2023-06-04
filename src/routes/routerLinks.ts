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
router.post('/user/uploadMedia',protect.protect,upload.single('file'),userController.uploadMedia)
router.get('/user/getMedia/:container/:id',protect.protect,userController.getUploadedMedia)
router.delete('/user/deleteUploadedMedia/:container/:filename/:id',protect.protect,userController.deleteUploadedMedia)
router.put('/user/updateUploadedMedia/:container/:filename/:id',protect.protect,upload.single('file'),userController.updateUploadedMedia)
router.post('/user/sendDeleteAccountToken',protect.protect,userController.sendDeleteAccountToken)
router.delete('/user/deleteAccount',protect.protect,userController.deleteAccount)
router.put('/user/deactivateAccount/:id',protect.protect,userController.deactivateAccount) 
router.put('/user/updateProfile/:id',protect.protect,adminDashboardController.updateProfile) 

//admin endpoint
router.get('/adminDashboard/getPublishers',protect.protect,adminDashboardController.getPublishers)
router.get('/adminDashboard/getAdvancers',protect.protect,adminDashboardController.getAdvancers)
router.get('/adminDashboard/getAdmins',protect.protect,adminDashboardController.getAdmins)
router.post('/adminDashboard/approvePublisher/:id',protect.protect,adminDashboardController.approvePublisher)
router.post('/adminDashboard/suspendAdvancer/:id',protect.protect,adminDashboardController.suspendAdvancer)
router.post('/adminDashboard/revokePublisher/:id',protect.protect,adminDashboardController.revokePublisher)
router.post('/adminDashboard/sendEmailTo',protect.protect,adminDashboardController.sendEmailTo)   
router.get('/adminDashboard/getAdminProfile/:id',protect.protect,adminDashboardController.getAdminProfile) 
router.post('/adminDashboard/addAdmin',protect.protect,adminDashboardController.addAdmin)  
router.post('/adminDashboard/makeSuperAdmin/:id',protect.protect,adminDashboardController.makeSuperAdmin)
router.post('/adminDashboard/switchToPublisher/:id',protect.protect,adminDashboardController.switchToPublisher) 
router.post('/adminDashboard/switchToAdmin/:id',protect.protect,adminDashboardController.switchToAdmin) 

//articles endpoints
router.post('/articles/addArticle',protect.protect,articlesController.addArticle)  
router.post('/articles/advanceStory',protect.protect,articlesController.advanceStory)  
router.post('/articles/addArticleCategory',protect.protect,articlesController.addArticleCategory)  
router.get('/articles/getArticles',protect.protect,articlesController.getArticles)   
router.get('/articles/getAdvancedStories',protect.protect,articlesController.getAdvancedStories)   
router.get('/articles/getArticleCategories',protect.protect,articlesController.getArticleCategories)  
router.get('/articles/getRecentArticles',protect.protect,articlesController.getRecentArticles)  

//subscribing
router.post('/subscription/addPlan',subscriptionsController.addPlan)  
router.post('/subscription/updatePublisherSubscription',protect.protect,subscriptionsController.updatePublisherSubscription)
router.post('/subscription/updateAdvancerSubscription',protect.protect,subscriptionsController.updateAdvancerSubscription)
router.get('/subscription/getPlans',protect.protect,subscriptionsController.getPlans)   

// metrics
router.post('/metrics/addReadArticle',protect.protect,metricsController.addReadArticle)  
router.post('/metrics/addViewedArticle',protect.protect,metricsController.addViewedArticle)
router.get('/metrics/getReadArticles',protect.protect,metricsController.getReadArticles) 
router.get('/metrics/getViewedArticles',protect.protect,metricsController.getViewedArticles) 
router.get('/metrics/getPostedArticlesMonthly',protect.protect,metricsController.getPostedArticlesMonthly) 
router.get('/metrics/getWeeklyTopPublishers',protect.protect,metricsController.getWeeklyTopPublisher) 
router.get('/metrics/getWeeklyTopAdvancers',protect.protect,metricsController.getWeeklyTopAdvancers) 
router.get('/metrics/getpublishedArticlesLocated',protect.protect,metricsController.getpublishedArticlesLocated) 

// notifications
router.put('/notifications/unsubcribeToNotifications/:id',protect.protect,notificationsController.unsubcribeToNotifications)  
router.post('/notifications/subscribeToNotifications',protect.protect,notificationsController.subscribeToNotifications)
router.put('/notifications/getNotifications/:id',protect.protect,notificationsController.getNotifications) 
router.post('/notifications/sendNotification',protect.protect,notificationsController.sendNotification)   
router.get('/notifications/getNotificationTypes',protect.protect,notificationsController.getNotificationTypes)  
router.post('/notifications/addNotificationType',protect.protect,notificationsController.addNotificationType)  

// publishers endpoints
router.get('/publisherDashboard/getPublisherArticles/:id',protect.protect,publisherDashboardController.getPublisherArticles)                        
router.get('/publisherDashboard/getDraftArticles/:id',protect.protect,publisherDashboardController.getDraftArticles)                        
router.get('/publisherDashboard/getPublisherPlan/:id',protect.protect,publisherDashboardController.getPublisherPlan)
router.put('/publisherDashboard/editArticle/:id',protect.protect,publisherDashboardController.editArticle)
router.delete('/publisherDashboard/deleteArticle/:id',protect.protect,publisherDashboardController.deleteArticle)   
router.get('/publisherDashboard/getRepublishedArticlesNo/:id',protect.protect,publisherDashboardController.getRepublishedArticlesNo)  
router.get('/publisherDashboard/getReadArticlesNo/:id',protect.protect,publisherDashboardController.getReadArticlesNo) 
router.get('/publisherDashboard/getPublishedArticlesNo/:id',protect.protect,publisherDashboardController.getPublishedArticlesNo) 
router.get('/publisherDashboard/getViewedArticlesNo/:id',protect.protect,publisherDashboardController.getViewedArticlesNo)  
router.get('/publisherDashboard/getNoFollowers/:id',protect.protect,publisherDashboardController.getNoFollowers) 
router.get('/publisherDashboard/getViewsByMonth/:id',protect.protect,publisherDashboardController.getViewsByMonth) 
router.get('/publisherDashboard/getReadsByMonth/:id',protect.protect,publisherDashboardController.getReadsByMonth)    
router.get('/publisherDashboard/getTopPublisherArticles/:id',protect.protect,publisherDashboardController.getTopPublisherArticles) 
router.get('/publisherDashboard/getRecentPublisherArticles/:id',protect.protect,publisherDashboardController.getRecentPublisherArticles)  
router.get('/publisherDashboard/getCurrentPublisherById/:id',protect.protect,publisherDashboardController.getCurrentPublisherById) 

// advancer endpoints
router.post('/advancerDashboard/republishArticle/:id',protect.protect,advancerDashboardController.republishArticle)  
router.get('/advancerDashboard/getRepublishedArticles/:id',protect.protect,advancerDashboardController.getRepublishedArticles) 
router.get('/advancerDashboard/getfollowedPublishersNo/:id',protect.protect,advancerDashboardController.getfollowedPublishersNo) 
router.post('/advancerDashboard/followPublisher/:id',protect.protect,advancerDashboardController.followPublisher)
router.post('/advancerDashboard/unFollowPublisher/:id',protect.protect,advancerDashboardController.unFollowPublisher)
router.get('/advancerDashboard/getFollowedPublishers/:id',protect.protect,advancerDashboardController.getFollowedPublishers) 
router.put('/advancerDashboard/addWebsiteLink/:id',protect.protect,advancerDashboardController.addWebsiteLink) 
router.put('/advancerDashboard/deleteWebsiteLink/:id',protect.protect,advancerDashboardController.deleteWebsiteLink) 
router.put('/advancerDashboard/updateAdvancerProfile',protect.protect,userController.updateAdvancerProfile)
router.get('/advancerDashboard/getAdvancerById/:id',protect.protect,advancerDashboardController.getAdvancerById) 

//landing page endpoints
router.get('/landingPage/getNoMonthlyReads',landingPageController.getNoMonthlyReads) 
router.get('/landingPage/getNoAdvancers',landingPageController.getNoAdvancers) 
router.get('/landingPage/getNoPublishers',landingPageController.getNoPublishers) 
router.get('/landingPage/getNoArticles',landingPageController.getNoArticles) 
router.post('/landingPage/sendContactUsEmail',userController.sendContactUsEmail) 
router.post('/landingPage/subscribeToNewsLetter',userController.subscribeToNewsLetterEmail) 
router.get('/landingPage/getTopThreeArticles',articlesController.getArticlesForLandingPage)  


// all users endpoints
router.get('/',userController.welcome)

module.exports = router;