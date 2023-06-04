
const articleModel = require('../models/articleModel')
const User = require('../models/userModel')
const categoryModel = require('../models/categoryModel')
export{}


//add article with Media
const addArticle = async (req:any,res:any)=>{   

    try {
        const category = await categoryModel.findById(req.body.categoryId)
        const user = await User.findById(req.body.userId)
        if(category){
            const article = await articleModel.create({
                userId: req.body.userId,
                category:{ 
                         categoryId:req.body.categoryId,
                         name:category.name },
                title: req.body.title,
                body: req.body.body,
                state: req.body.state,
                userInfo:{username:user.name,surname:user.surname}
                  });
    
            if(article){
                res.status(200).json( {'status':true,article:article,message:"article successfully added"})                 
              }
            else{
                res.status(400).json({'status':false,error: 'Error uploading the article info'})
            }
        }
        else{
            res.status(400).json({'status':false,error: 'Category not found'})

        }
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
        }

    }
    
//add article with Media
const addArticleCategory = async (req:any,res:any)=>{   

    try {
        const article = await categoryModel.create({
            name: req.body.name,
              });

        if(article){
            res.status(200).json( {'status':true,message:"article category successfully added"})                 
          }
        else{
            res.status(400).json({'status':false,error: 'Error uploading the article info'})
        }
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
        }

    }
//get articles
const getArticleCategories = async (req:any,res:any) => {
    
    try {
        var query = await categoryModel.find().sort({createdAt: -1});
        if(!query){
            res.status(400).json({'status':false,error: "no category found"})
        }
        res.status(200).json( {'status':true,'categories':query});
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       }
}

//add article with Media
const advanceStory = async (req:any,res:any)=>{   
    const d = new Date();
    let month = d.getMonth();

    try {
        const article = await articleModel.findByIdAndUpdate(req.body.articleId,{
            $push:{"advanced":{advancerUserId: req.body.advancerUserId,month:month}},$inc:{"advanceCount":1}});

        if(article){
            res.status(200).json( {'status':true,article:article,message:"successfully advanced story"})                 
          }
        else{
            res.status(400).json({'status':false,error: 'Error uploading the article info'})
        }
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
        }

    }

//get articles
const getArticles = async (req:any,res:any) => {
    
    try {
        const aticles = await articleModel.find({"state":"published"}).sort({createdAt: -1})
        if(!aticles){
            res.status(400).json({error: "There are no advanced articles"})
        }
        res.status(200).json( {'status':true,list:aticles});    
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}
//get articles
const getArticlesForLandingPage = async (req:any,res:any) => {
    
    try {
        const aticles = await articleModel.find({"state":"published"}).sort({createdAt: -1}).limit(3)
        if(!aticles){
            res.status(400).json({error: "There are no published articles"})
        }
        res.status(200).json( {'status':true,list:aticles});    
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}
//get articles
const getAdvancedStories = async (req:any,res:any) => {
    
    try {
        const aticles = await articleModel.find({"advanceCount":{$gt:0},"state":"published"}).sort({createdAt: -1});
        if(!aticles){
            res.status(400).json({error: "There are no advanced articles"})
        } 
        res.status(200).json( {'status':true,list:aticles});    
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}
//get articles
const getRecentArticles = async (req:any,res:any) => {

    try {
        const articles = await articleModel.find({"state":"published"}).sort({createdAt: -1}).limit(4);
        if(!articles){
            res.status(400).json({error: "There are no articles"})
        }
        res.status(200).json( {'status':true,list:articles});    
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 

}

//for many
module.exports = {addArticle,getArticles,advanceStory,getAdvancedStories,getArticleCategories,addArticleCategory,getRecentArticles,getArticlesForLandingPage}