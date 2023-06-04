const articleModel = require('../models/articleModel')
const publisherModel = require('../models/publisherModel')
const User = require('../models/userModel')
const advancerModel = require('../models/advancerModel')
const publisherProfile = require('../models/publisherModel')
import axios from 'axios';
export{}

//republish article
const republishArticle = async (req:any,res:any)=>{   
    const {articleId} = req.body;
    
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var todayDate = mm + '/' + dd + '/' + yyyy;
    try {
        const advancerObject = await advancerModel.findOne({userId:req.params.id});
        const user = await User.findById(req.params.id);
        const article = await articleModel.findById(articleId);
        const website = advancerObject.website;
        if(article&&advancerObject){
            //send article info to wordpress
            type CreatePost = {
                title: string;
                content: string;
                status: string;
                };

        try {
                                
            try {
                const { data, status } = await axios.post<CreatePost>(
                    `${advancerObject.website}/wp-json/wp/v2/posts`,
                    { title: article.title, content: `<!-- wp:paragraph -->${article.body}<!-- /wp:paragraph -->`, status: "draft" },
                    {
                        headers: {
                        'Content-Type': 'application/json',
                        "Accept": 'application/json',
                        "Authorization": "Basic " + Buffer.from(`${advancerObject.wordpressAdminName}:${advancerObject.applicationPassword}`).toString("base64")
                        },
                    },);
                    
                try {
                    const pic = await articleModel.findOneAndUpdate({_id:articleId},{$push:{"advanced":
                                        { name: user.name,
                                        surname: user.surname,
                                        advancerUserId:req.params.id,
                                        date: todayDate}},$inc:{"advanceCount":1}});
                                     res.status(200).json( {'status':true,message:"Successfully advanced a story"});
                    
                } catch (error) {
                    res.status(400).json({'status':false,error: 'The article successfully republihed to wordpress but failed to be saved in our database '})
                    
                }
            } catch (error:any) {
                if (axios.isAxiosError(error)) {
                    res.status(400).json({error: 'From axios: '+error.message+""+website});
                } else {
                    res.status(400).json({error: 'An unexpected error occurred'})
                }  
            }
                    
        } catch (error:any) {
            res.status(400).json({error: error.message})   
        }

        }else{

            res.status(400).json({'status':false,error: 'User is not an advancer or the article does not exist '})
        }
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
        }
    }
//get advancer by id
const getAdvancerById = async (req:any,res:any) => {

    try {
        const advancerObject = await advancerModel.findOne({userId:req.params.id});
        if(!advancerObject){
            res.status(400).json({error: "user not found"})
        }
        else{
        res.status(200).json(
            {'status':true,
            "AdvancerObject":advancerObject});
        }
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       }
}
    //get republished articles
const getRepublishedArticles = async (req:any,res:any) => {

    try {
        const articles = await articleModel.find({$and:[{"advanced.advancerUserId":req.params.id}]}).select('-advanced');
        if(!articles){
            res.status(400).json({error: "user not found"})
        }
        res.status(200).json( {'status':true,list:articles});
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       }
}
//get a number of followed publishers
const getfollowedPublishersNo = async (req:any,res:any) => {
    const user = await User.find({userId:req.params.id})
    if(user){

        try {
            const articles = await publisherProfile.countDocuments({$and:[{"followers.advancerUserId":req.params.id}]},function (err:any, count:any) {
                if (err) res.status(400).json({error: err.message})
                   else res.status(200).json( {'status':true,count:count});
               })    
        } catch (error:any) {
            res.status(400).json({error: error.message})   
            }

    }else{
        res.status(400).json({'status':false,error: 'User not found'})
    }
}
//get followed publishers
const getFollowedPublishers = async (req:any,res:any) => {
     let publisherArray = [];
    try {
        const publishers = await publisherProfile.find({$and:[{"followers.advancerUserId":req.params.id}]});
        if(!publishers){
            res.status(400).json({error: "user not found"})
        }
        else{
            for(var x=0;x<=publishers.length-1;x++){
            let publisherUserDetail = await User.findById(publishers[x].userId);
            let object={
                "name":publisherUserDetail.name,
                "publisherUserId":publisherUserDetail._id,
                "surnme":publisherUserDetail.surname,
                "organisation":publishers[x].organisation,
                "email":publisherUserDetail.email,
                "date":publishers[x].followers.filter((date: { advancerUserId: any })=>req.params.id==date.advancerUserId),
            }
            publisherArray.push(object)
            }
            res.status(200).json( {'status':true,list:publisherArray});
        }
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       }
}

//get followed publishers
const unFollowPublisher = async (req:any,res:any) => {
    const {publisherUserId} = req.body;
    try {
        const publisher = await publisherProfile.findOne({userId:publisherUserId,$and:[{"followers.advancerUserId":req.params.id}]});
        if(!publisher){
            res.status(400).json({error: "You are not following this publisher"})
        }
        else{
            try {
                const unfollow = await publisherModel.findOneAndUpdate({userId:publisherUserId},{$pull:{"followers":
                              { advancerUserId:req.params.id}},$inc:{"NoFollowers":-1}});

                   res.status(200).json( {'status':true,message:"Successfully unfollowed a publisher"})

            } catch (error:any) {
                res.status(400).json({error: error.message})  
            }
        }
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       }
}
//follow a certain publisher
const followPublisher = async (req:any,res:any)=>{   
    const {publisherUserId} = req.body;
    
    var today = new Date(); 
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var todayDate = mm + '/' + dd + '/' + yyyy;
    const publishers = await publisherProfile.find({$and:[{"followers.advancerUserId":req.params.id}]});

    let publisher = publishers.filter((publisher: { userId: any }) => {
        return publisher.userId==publisherUserId;
      });

    if (publisher.length>0) {
        
        res.status(400).json({'status':false,error: 'You have already followed this publisher'})
        
    } else {

        try {
            const user = await User.findById(req.params.id)
            if(user){
                try {
                    const pic = await publisherModel.findOneAndUpdate({userId:publisherUserId},{$push:{"followers":
                                  { name: user.name,
                                    surname: user.surname,
                                    advancerUserId:req.params.id,
                                    date: todayDate}},$inc:{"NoFollowers":1}});

                       res.status(200).json( {'status':true,message:"Successfully followed a publisher"})
                    
                } catch (error:any) {
                    res.status(400).json({error: error.message})  
                }
            }else{
    
                res.status(400).json({'status':false,error: 'User not found'})
            }
            
        } catch (error:any) {
            res.status(400).json({error: error.message})   
            }
    }

    }

//republish article
const addWebsiteLink = async (req:any,res:any)=>{   
    const {websiteLink} = req.body;
    
  if (isValidUrl(websiteLink)) {
    try {
        const user = await User.findById(req.params.id)
        const advancer = await advancerModel.find({userId:user._id})
        if(advancer){
            const pic = await advancerModel.findOneAndUpdate({userId:req.params.id},{$push:{"website":
                          { websiteLink: websiteLink}}})
               res.status(200).json( {'status':true,message:"Successfully followed a publisher"})
            .catch((err:any)=>res.status(400).json({error: err.message}))

        }else{

            res.status(400).json({'status':false,error: 'User is not an advancer'})
        }
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
        }
    
  } else {
    
    res.status(400).json({'status':false,error: 'Invalid URL'})
  }

    }
//allow the advancer to delete the uploaded 
const deleteWebsiteLink = async (req:any,res:any) => {
    const {websiteLink} = req.body;
    
  if (isValidUrl(websiteLink)) {

    const pic =  advancerModel.findOneAndUpdate({userId:req.params.id},{$pull:{'website':{websiteLink:websiteLink}}}); 

    pic.save().then(()=>res.status(200).json( {'status':true,message:"Website successfully deleted"}))
    .catch((err:any)=>res.status(400).json({error: err.message})) 
       
 } 
  else {
            
            res.status(400).json({'status':false,error: 'Invalid URL'})
        }
    }

function isValidUrl(string:any) {
        try {
          new URL(string);
          return true;
        } catch (err) {
          return false;
        }
      }
module.exports = {republishArticle,getRepublishedArticles,getFollowedPublishers,followPublisher,getfollowedPublishersNo,deleteWebsiteLink,addWebsiteLink,getAdvancerById,unFollowPublisher}
