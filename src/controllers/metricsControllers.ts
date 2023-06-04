
const articleModel = require('../models/articleModel')
const userModel = require('../models/userModel')
var ObjectId = require('mongoose').Types.ObjectId;
export{}
 

//get articles
const getPostedArticlesMonthly = async (req:any,res:any) => {
    
    try {
        const articles = await articleModel.aggregate(
            [
              {
                $project:
                  {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                    week: { $week: "$createdAt" }
                  }
              }
            ]
         )
        res.status(200).json( {'status':true,articles:articles});
        } catch (error:any) {
        res.status(400).json({error: error.message})   
       }
}


//get articles
const getReadArticles = async (req:any,res:any) => {
    
    try {
        articleModel.countDocuments({"metrics.read":{$gt:0}},function (err:any, count:any) {
            if (err) res.status(400).json({error: err.message})
               else res.status(200).json( {'status':true,count:count});
           });
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       }
}

//get articles
const getViewedArticles= async (req:any,res:any) => {
    
    try {
         articleModel.countDocuments({"viewed":{$gt:0}},function (err:any, count:any) {
                if (err) res.status(400).json({error: err.message})
                else res.status(200).json( {'status':true,count:count});
            });
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       }
}

//get articles
const addViewedArticle = async (req:any,res:any) => {
    const  {articleId} = req.body;
    const d = new Date();
    let month = d.getMonth();
    
    if(ObjectId.isValid(articleId)){ 
    try {
        const viewedArticle = await articleModel.findByIdAndUpdate(
            articleId,
            {$inc:{"viewed":1},$push:{"views":{month: month}}}
            );

        res.status(200).json( {'status':true,message:'viewing of this article saved'})      
    } catch (error:any) {
        res.status(400).json({error: error.message})   
        }
    }
    else{
        res.status(400).json({status:false,error: 'The provided Id is invalid'})
    }
}

//get articles
const addReadArticle = async (req:any,res:any) => {
    const  {articleId} = req.body;
    const d = new Date();
    let month = d.getMonth();
    
    if(ObjectId.isValid(articleId)){ 
    try {
        const readArticle = await articleModel.findByIdAndUpdate(articleId,
            {$inc:{"read":1}, $push:{"reads":{month: month}}});
        res.status(200).json( {'status':true,message:'reading of this article saved'})      
    } catch (error:any) {
        res.status(400).json({error: error.message})   
        }
    }
    else{
        res.status(400).json({status:false,error: 'The provided Id is invalid'})
    }
}

//get articles
const getWeeklyTopPublisher = async (req:any,res:any) => {
    
    try {
        const aticles = await userModel.aggregate([  
            { $lookup:
               {
                 from: 'articles',
                 localField: '_id',
                 foreignField: 'userId',
                 as: 'articles'
               },
             },
             {$unwind: "$articles" },
             {$group: { _id: "$userId","username": {$first:"$name"},"surname":  {$first:"$surname"},"userId":  {$first:"$_id"},"location":  {$first:"$countryCode"},number_of_articles:   { $sum: 1 } }},
             {$project: {"name":"$username","surname": "$surname","location":"$location","userId":"$userId", _id:0, number_of_articles: 1 } },
             {$sort: { number_of_articles: 1 } }]);
        if(!aticles){
            res.status(400).json({error: "There are no articles"})
        }
        res.status(200).json( {'status':true,list:aticles});    
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}

//get articles
const getWeeklyTopAdvancers = async (req:any,res:any) => {
    
    try {
        const aticles = await userModel.aggregate([  
            { $lookup:
               {
                 from: 'advancedstories',
                 localField: '_id',
                 foreignField: 'advancerUserId',
                 as: 'articles'
               },
             },
             {$unwind: "$articles" },
             {$group: { _id: "$advancerUserId","username": {$first:"$name"},"surname":  {$first:"$surname"},"userId":  {$first:"$_id"},"location":  {$first:"$countryCode"},number_of_articles:   { $sum: 1 } }},
             {$project: {"name":"$username","surname": "$surname","location":"$location","userId":"$userId", _id:0, number_of_articles: 1 } },
             {$sort: { number_of_articles: 1 } }]);
        if(!aticles){
            res.status(400).json({error: "There are no articles"})
        }
        res.status(200).json( {'status':true,list:aticles});    
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}
const getpublishedArticlesLocated = async (req:any,res:any) => { 
    try {
        const aticles = await userModel.aggregate([  
            { $lookup:
               {
                 from: 'articles',      
                 localField: '_id',
                 foreignField: 'userId',
                 as: 'articles'
               },
             },
             {$unwind: "$articles" },
             {$group: { _id: "$countryCode","location":  {$first:"$countryCode"},number_of_articles:   { $sum: 1 } }},
             {$project: {"location":"$location", number_of_articles: 1 } },
             {$sort: { number_of_articles: 1 } }]);
        if(!aticles){
            res.status(400).json({error: "There are no articles"})
        }
        res.status(200).json( {'status':true,list:aticles});    
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}

//for many 
module.exports = {
    getWeeklyTopPublisher,
    getPostedArticlesMonthly,
    getReadArticles,
    getViewedArticles,
    addReadArticle,
    addViewedArticle,
    getWeeklyTopAdvancers,
    getpublishedArticlesLocated
    }