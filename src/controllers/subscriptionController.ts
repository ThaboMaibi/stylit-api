
const planModel = require('../models/planModel')
const advancerProfile = require('../models/advancerModel')
const publisherProfile = require('../models/publisherModel')
var ObjectId = require('mongoose').Types.ObjectId;
export{}
 

//add article with Media
const addPlan = async (req:any,res:any)=>{   

    try {
        const plan = await planModel.create({
                        planName: req.body.planName,
                        price: req.body.price
                        });

        if(plan){
            res.status(200).json( {'status':true,plan:plan})                 
          }
        else{
            res.status(400).json({'status':false,error: 'Error uploading the plan info'})
        }
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
        }

    }

    const updateAdvancerSubscription = async (req:any,res:any)=>{  
        const  {userId,planId} = req.body;
        
        if(ObjectId.isValid(userId)||ObjectId.isValid(userId)){ 
        try {
            const advancer = advancerProfile.findOneAndUpdate({userId},{planId:planId}) 
            res.status(200).json( {'status':true,message:'added a subcription to the advancer'})    
        } catch (error:any) {
            res.status(400).json({error: error.message})   
            }
        }
        else{
            res.status(400).json({status:false,error: 'The provided Id is invalid'})
        }

    }

    const updatePublisherSubscription = async (req:any,res:any)=>{  
        const  {userId,planId} = req.body;
        
        if(ObjectId.isValid(userId)||ObjectId.isValid(userId)){ 
        try {
            const advancer = publisherProfile.findOneAndUpdate({userId},{planId:planId}) 
            res.status(200).json( {'status':true,message:'added a subcription to the advancer'})    
        } catch (error:any) {
            res.status(400).json({error: error.message})   
            }
        }
        else{
            res.status(400).json({status:false,error: 'The provided Id is invalid'})
        }
    }

//get articles
const getPlans = async (req:any,res:any) => {
    
    try {
        const plans = await planModel.find().sort({createdAt: -1});
        if(!plans){
            res.status(400).json({error: "no data found"})
        }
        res.status(200).json( {'status':true,list:plans});
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       }
}

//for many 
module.exports = {getPlans,addPlan,updatePublisherSubscription,updateAdvancerSubscription}