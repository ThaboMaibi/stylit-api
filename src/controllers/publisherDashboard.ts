const MediaModel = require('../models/mediaModel')
const articleModel = require('../models/articleModel')
const categoryModel = require('../models/categoryModel')
const subscriptionModel = require('../models/subscribersModel')
const publisherProfile = require('../models/publisherModel')
var ObjectId = require('mongoose').Types.ObjectId;
export{}



//edit article
const editArticle = async (req:any,res:any)=>{   

    try {
        const category = await categoryModel.findById(req.body.categoryId)
        if(category){
            const article = await articleModel.findByIdAndUpdate(req.params.id,{
                category:{ 
                         categoryId:req.body.categoryId,
                         name:category.name },
                title: req.body.title,
                body: req.body.body,
                state: req.body.state,
                  });
    
            if(article){
                res.status(200).json( {'status':true,article:article,message:"article successfully edited"})                 
              }
            else{
                res.status(400).json({'status':false,error: 'Error uploading the article info'})
            }

        }else{

            res.status(400).json({'status':false,error: 'Category not found'})
        }
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
        }

    }

// delete article
const deleteArticle = async (req:any,res:any)=>{   

    try {
        const article = await articleModel.findByIdAndDelete(req.params.id);
        if(article){
            try {
                const articleMedia = await MediaModel.findOneAndDelete({articleId:article._id});  
                res.status(200).json( {'status':true,article:article,message:"article successfully deleted"})  
            } catch (error:any) {
                res.status(400).json({error: error.message})
            }                
            }
        else{
            res.status(400).json({'status':false,error: 'Error deleting the article info'})
        }    
    } catch (error:any) {
        res.status(400).json({error: error.message})   
        }

    }

//add article Media


//get articles
const getPublisherArticles = async (req:any,res:any) => {

    const userId = req.params.id;
    if(ObjectId.isValid(userId)){
    
    try {
        const articles = await articleModel.find({"userId":req.params.id}).sort({createdAt: -1});
        if(!articles){
            res.status(400).json({error: "There are no advanced articles"})
        }
        res.status(200).json( {'status':true,list:articles});    
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
    }
  else{
    res.status(400).json({status:false,error: 'the provided user Id is invalid'})
  }
}

//get articles
const getDraftArticles = async (req:any,res:any) => {
    
    try {
        const articles = await articleModel.find({"userId":req.params.id,"state":"draft"}).sort({createdAt: -1})
           if(!articles){
            res.status(400).json({error: "There are no drafts articles"})
        }
        res.status(200).json( {'status':true,list:articles});    
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}

//get publisher plan
const getPublisherPlan = async (req:any,res:any)=>{   

    try {
        const plan = await subscriptionModel.aggregate( [
                  {$match: {$expr:{$eq:[ "userId", req.params.id] } }},
                  { $group: {
                      _id: '$_id',
                      "userId": { $first: '$userId'}, 
                      "planId": { $first: '$planId'}}
                  },
                  {$project: {"id":"$userId", _id:0, } }
            ]);

        if(plan){
            res.status(200).json( {'status':true,plan:plan})                 
          }
        else{
            res.status(400).json({'status':false,error: 'No subscription found'})
        }
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
        }

    }
//get articles
const getRepublishedArticlesNo = async (req:any,res:any) => {
    
    try {
        articleModel.countDocuments({"userId":req.params.id,"advanceCount":{$gt:0}},function (err:any, count:any) {
               if (err) res.status(400).json({error: err.message})
               else res.status(200).json( {'status':true,count:count});
           }); 
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}
//get articles
const getReadArticlesNo = async (req:any,res:any) => {
    
    try {
        articleModel.countDocuments({"userId":req.params.id,"metrics.read":{$gt:0}},function (err:any, count:any) {
               if (err) res.status(400).json({error: err.message})
               else res.status(200).json( {'status':true,count:count});
           });   
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}

//get articles
const getNoFollowers = async (req:any,res:any) => {
    
    try {
        const publisher = await publisherProfile.find({"userId":req.params.id})
        if(!publisher){
            res.status(400).json({error: "The user is not a publisher"})
        }
        res.status(200).json( {'status':true,count:publisher.NoFollowers});    
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}
//get articles
const getViewedArticlesNo = async (req:any,res:any) => {
    
    try {
        articleModel.countDocuments({"userId":req.params.id,"viewed":{$gt:0}},function (err:any, count:any) {
               if (err) res.status(400).json({error: err.message})
               else res.status(200).json( {'status':true,count:count});
           });     
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}

//for many
const getRepublishedByMonth = async (req:any,res:any) => {

    const userId = req.params.id;
    if(ObjectId.isValid(userId)){
    
    try {
        const articles = await articleModel.find({"userId":req.params.id,"advanceCount":{$gt:0}}).sort({createdAt: -1});
        if(!articles){
            res.status(400).json({error: "There are no advanced articles"})
        }
        res.status(200).json( {'status':true,articlId:articles._id,advancers:articles.advanced});    
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
    }
  else{
    res.status(400).json({status:false,error: 'the provided user Id is invalid'})
  }
}
//for many
const getViewsByMonth = async (req:any,res:any) => {

    const userId = req.params.id;
    if(ObjectId.isValid(userId)){
    
    try {
        const articles = await articleModel.find({"userId":req.params.id,"viewed":{$gt:0}}).sort({createdAt: -1});
        if(!articles){
            res.status(400).json({error: "There are no viewed articles"})
        }
        res.status(200).json( {'status':true,articlId:articles._id,advancers:articles.views});    
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
    }
  else{
    res.status(400).json({status:false,error: 'the provided user Id is invalid'})
  }
}
//for many
const getReadsByMonth = async (req:any,res:any) => {

    const userId = req.params.id;
    if(ObjectId.isValid(userId)){
    
    try {
        const articles = await articleModel.find({"userId":req.params.id,"metrics.read":{$gt:0}}).sort({createdAt: -1});
        if(!articles){
            res.status(400).json({error: "There are no read articles"})
        }
        res.status(200).json( {'status':true,articlId:articles._id,advancers:articles.reads});    
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
    }
  else{
    res.status(400).json({status:false,error: 'the provided user Id is invalid'})
  }
}

//get articles
const getTopPublisherArticles = async (req:any,res:any) => {

    const userId = req.params.id;
    if(ObjectId.isValid(userId)){
    
    try {
        const articles = await articleModel.find({"userId":req.params.id,"state":"published"}).sort({viewed: -1}).limit(4);
        if(!articles){
            res.status(400).json({error: "There are no articles"})
        }
        res.status(200).json( {'status':true,list:articles});    
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
    }
  else{
    res.status(400).json({status:false,error: 'the provided user Id is invalid'})
  }
}
//get articles
const getPublishedArticlesNo = async (req:any,res:any) => {
    
    try {
        articleModel.countDocuments({"userId":req.params.id,"state":"published"},function (err:any, count:any) {
               if (err) res.status(400).json({error: err.message})
               else res.status(200).json( {'status':true,count:count});
           });     
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}
//get advancer by id
const getCurrentPublisherById = async (req:any,res:any) => {

    try {
        const publisherObject = await publisherProfile.findOne({userId:req.params.id});
        if(!publisherObject){
            res.status(400).json({error: "user not a publisher"})
        }
        res.status(200).json(
            {'status':true,
            "ApproveStatus":publisherObject.status,
            "organisation":publisherObject.organisation,
            "NoFollowers":publisherObject.NoFollowers});
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       }
}
//get articles
const getRecentPublisherArticles = async (req:any,res:any) => {

    const userId = req.params.id;
    if(ObjectId.isValid(userId)){
    
    try {
        const articles = await articleModel.find({"userId":req.params.id,"state":"published"}).sort({createdAt: -1}).limit(4);
        if(!articles){
            res.status(400).json({error: "There are no articles"})
        }
        res.status(200).json( {'status':true,list:articles});    
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
    }
  else{
    res.status(400).json({status:false,error: 'the provided user Id is invalid'})
  }
}

module.exports = {editArticle,
                  deleteArticle,
                  getPublisherArticles,
                  getDraftArticles,
                  getPublisherPlan,
                  getRepublishedArticlesNo,
                  getReadArticlesNo,
                  getViewedArticlesNo,
                  getRepublishedByMonth,
                  getViewsByMonth,
                  getReadsByMonth,
                  getTopPublisherArticles,
                  getRecentPublisherArticles,
                  getPublishedArticlesNo,
                  getNoFollowers,
                  getCurrentPublisherById
                }