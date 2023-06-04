const notificationsModel = require('../models/notificationsModel')
const notificationsubscribersModel = require('../models/notificationSubscriberModel')
const notificationTypeModel = require('../models/notificationTypeModel')
var ObjectId = require('mongoose').Types.ObjectId;

//send the notification to the subscribers
const sendNotification = async (req:any,res:any) => {
    const  {message,to} = req.body; 
    try {
        const sentNotification = await notificationsModel.create({
            message: message,
            to: to,
              });
        res.status(200).json( {'status':true,sentNotification:sentNotification})      
    } catch (error:any) {
        res.status(400).json({error: error.message})   
        }
    }

//get the list of notification
const getNotifications = async (req:any,res:any) => {
    const  {typeId} = req.body; 

        try {
            const isSubscriber = await notificationsubscribersModel.findOne({userId:req.params.id,typeId:typeId})
            if (isSubscriber) {
                try {
                    const Notifications = await notificationsModel.find({typeId:typeId}).sort({createdAt: -1})
                    res.status(200).json( {'status':true,Notifications:Notifications})   
                } catch (error:any) {
                    res.status(400).json({error: error.message}) 
                }
                
            } else {
                res.status(400).json({error: 'The user has not subscribed to these notifications'})   
            }   
        } catch (error:any) {
            res.status(400).json({error: error.message})   
            }
    }
    
//subscribe to all notifications
const subscribeToNotifications = async (req:any,res:any) => {   
    const  {userId,typeId,email} = req.body; 

 
    try {
        const subscribe = await notificationsubscribersModel.create({userId,email,typeId});
        if(subscribe){
            res.status(200).json( {'status':true,subscribed:subscribe})                 
          }
        else{
            res.status(400).json({'status':false,error: 'Error subscribe notifications'})
        }
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
        }
    
   } 

//unsubcribe to notifications
const unsubcribeToNotifications = async (req:any,res:any) => {
    const  {typeId} = req.body; 
    //array of notifications type
        try {
            const isSubscriber = await notificationsubscribersModel.findOneAndDelete({userId:req.params.id,typeId:typeId})
            res.status(200).json( {'status':true,message:'successfully unsubscribed to notifications'})     
        } catch (error:any) {
            res.status(400).json({error: error.message})   
            }
        
    }
//notification type
const addNotificationType= async (req:any,res:any)=>{   

    try {
        const notification = await notificationTypeModel.create({
                  name: req.body.name,
                });

        if(notification){
            res.status(200).json( {'status':true,message:"notification type successfully added"})                 
            }
        else{
            res.status(400).json({'status':false,error: 'Error uploading the notification type'})
        }
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
        }

    } 

//get notfication types
const getNotificationTypes = async (req:any,res:any) => {
    
    try {
        var query = await notificationTypeModel.find().sort({createdAt: -1});
        if(!query){
            res.status(400).json({'status':false,error: "no notification type found"})
        }
        res.status(200).json( {'status':true,'categories':query});
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       }
}

//for many 
module.exports = {
    unsubcribeToNotifications,
    subscribeToNotifications,
    getNotifications,
    sendNotification,
    getNotificationTypes,
    addNotificationType
    }
