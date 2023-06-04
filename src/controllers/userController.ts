const User = require('../models/userModel')
const advancerProfile = require('../models/advancerModel')
const adminProfile = require('../models/adminModel')
const publisherProfile = require('../models/publisherModel')
const profilePic = require('../models/profilePicModel')
const planModel = require('../models/planModel')
const MediaModel = require('../models/mediaModel')
const articleModel = require('../models/articleModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { passwordStrength } = require('check-password-strength')
const nodemailer = require('nodemailer')
import{ BlobServiceClient} from '@azure/storage-blob';
import {config} from 'dotenv';
const randomString = require("randomstring") 
import { OAuth2Client, UserRefreshClient } from "google-auth-library";
import { Request, Response } from "express";
var ObjectId = require('mongoose').Types.ObjectId;
config();

//uploading the images to azure blob
const BlobService = BlobServiceClient.fromConnectionString(`${process.env.AZURE_STORAGE_CONNECTION_STRING}`);
const clientId = `${process.env.GOOGLE_CLIENT_ID}`
const clientSecret = `${process.env.GOOGLE_CLIENT_SECRET}`

const googleClient = new OAuth2Client({
    clientId: clientId,
    clientSecret:clientSecret
  });

//returns tokens
const  GetGoogleTokens = async (req: Request, res: Response) => {
    try {
        const { tokens } = await googleClient.getToken(req.body.code); // exchange code for tokens
        console.log(tokens);
        
        res.status(200).json(tokens);
        
    } catch (error:any) {
        res.status(400).json(error); 
    }
 }
 //returns credentials
const  GetGoogleCredentials = async (req: Request, res: Response) => {
    try {
        const user = new UserRefreshClient(
            clientId,
            clientSecret,
            req.body.refreshToken,
        );
        const { credentials } = await user.refreshAccessToken(); // optain new tokens
      
        res.status(200).json(credentials); 
        
    } catch (error:any) {
        res.status(400).json(error);  
    } 
 }

const authenticateGoogleUser = async (req: Request, res: Response) => {
    const { token } = req.body;
    try {
        
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: `${process.env.GOOGLE_CLIENT_ID}`,
          });
        
          const payload = ticket.getPayload();

        let user = await User.findOne({ email: payload?.email });
        if (!user) {    
          user = await new User({
            email: payload?.email,
            surname: payload?.family_name,
            name: payload?.name,
            countryCode:payload?.locale,
            profilePicture:{name:payload?.picture},
            provider: 1,
          });
      
          await user.save();
          const freeplan = await planModel.findOne({planName:'Free Plan'});
          const Regadvancer = await advancerProfile.create({userId:user._id,planId:freeplan._id});
          const admin = await adminProfile.findOne({userId:user._id});
          const advancer = await advancerProfile.findOne({userId:user._id});
          const publisher = await publisherProfile.findOne({userId:user._id});
          const isAdmin = admin?true:false;
          const isAdvancer = advancer?true:false;
          const isPublisher = publisher?true:false;
          let role ={
              admin:isAdmin,
              publisher:isPublisher,
              advancer:isAdvancer
          }
          res.status(200).json({'status':true,AutToken:generateToken(user._id,user.name,
              user.surname,user.email,user.countryCode,role,user.profilePicture),user:{userId:user._id,firstName:user.name,
                  lastName:user.name,email:user.email,countryCode:user.countryCode,role} });

                  try {
                    const transporter = nodemailer.createTransport({
                        host:'smtp.gmail.com',
                        port:587,
                        secure:false,
                        requireTLS:true,
                        auth:{
                            user:"noreply@minorityafrica.org",
                            pass:process.env.EMAILPASSWORD
                        }
                    });
                    const mailOptions = {
                        from:'noreply@minorityafrica.org',
                        to:payload?.email,
                        subject:'Welcome to Advance',
                        html:'<p>Hi '+payload?.name+', Welcome to Advance, We are happy that you decided to join us on a journey to make Minority Voices be heard across Africa</p><br/><br/><p>The Advance team</p>'
                     }
                    transporter.sendMail(mailOptions,function(error:any,info:any){
                        if (error) {
                            console.log(error);
                            
                        } else {
                            console.log('message has been sent',info.response);
                            
                        }
                    })
                } catch (error:any) {  
                    res.status(400).json({status:false,error: error.message})   
                      
                }
        } 

    } catch (error:any) {
        res.status(400).json({error: error.message})   
    }
  };


//send mail
const sendMail = async (to:any,subject:any,html:any) => {

    try {
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:"noreply@minorityafrica.org",
                pass:process.env.EMAILPASSWORD
            }
        });
        const mailOptions = {
            from:'noreply@minorityafrica.org',
            to:to,
            subject:subject,
            html:html
         }
        transporter.sendMail(mailOptions,function(error:any,info:any){
            if (error) {
                console.log(error);
                return false
                
            } else {
                console.log('message has been sent',info.response);
                return true
                
            }
        })
    } catch (error:any) {  
        console.log(error.message);
        return false
          
    }
    
}


// update user password
const updatePassword = async (req:any,res:any)=>{
    const  {
        currentPassword, 
        newPassword} = req.body;
 // console.log(req.body);
    try {
        const user = await User.findById(req.params.id);
        if(user&&(await bcrypt.compare(currentPassword,user.password))){
            if (passwordStrength(newPassword).value==='Too weak'||passwordStrength(newPassword).value==='Weak') {
                res.status(400).
                json({
                'status':false,
                error: 'Your password is weak,It must be atleast 8 charecters and contain lowercase, uppercase, symbol and/or number'})  
            } else {
                if(currentPassword===newPassword){
                    res.status(400).
                    json({
                    'status':false,
                    error: 'You can not update the password with the same password, please enter a different password'}) 
                }
                else{
                    try {
                        // hash the password
                        const salt = await  bcrypt.genSalt(10);
                        const Hashedpassword = await bcrypt.hash(newPassword,salt);
        
                        const document = await User.findByIdAndUpdate(req.params.id, 
                            { password:Hashedpassword });
                        res.status(200).json( {'status':true,'message':'successfully updated the password'});   
                    } catch (error:any) {
                        res.status(400).json({error: error.message}) 
                    }
                }
            }
        }
        else{
            res.status(400).json({message:"current password is incorrect, please use the correct password"})  
        }
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       }
}

//log in 
const logIn = async (req:any,res:any)=>{
    const  {password, email} = req.body;
    if(!email||!password){
        res.status(400).json({status:false,error: 'please add all fields'}) 
    }
    else
    {
        if(passwordStrength(password).value==='Too weak'||passwordStrength(password).value==='Weak')
        {
            res.status(400).json({'status':false,error: 'Your password is weak,it must be atleast 8 charecters and contain lowercase, uppercase, symbol and/or number'})
        }
        else if(!ValidateEmail(email)){
            res.status(400).json({status:false,error: 'your email address is not valid'})
        }
        else
        {
        // console.log(req.body);
        try {
            const lowerCaseEmail = email.toLowerCase();
            const user = await User.findOne({email:lowerCaseEmail});
            if (user) {
                if(user&&(await bcrypt.compare(password,user.password))){
                    const admin = await adminProfile.findOne({userId:user._id});
                    const advancer = await advancerProfile.findOne({userId:user._id});
                    const publisher = await publisherProfile.findOne({userId:user._id});
                    const isAdmin = admin?true:false;
                    const isAdvancer = advancer?true:false;
                    const isPublisher = publisher?true:false;
                    let role ={
                        admin:isAdmin,
                        publisher:isPublisher,
                        advancer:isAdvancer
                    }
                    res.status(200).json({
                        'status':true,
                        'message':'succefull',
                        token:generateToken(user._id,user.name,
                            user.surname,user.email,user.countryCode,role,user.profilePicture),
                        userId:user.id,
                        email:user.email,
                        name:user.name,
                        surname:user.surname,
                        countryCode:user.countryCode,
                        isAccountDeactivated:user.isAccountDeactivated,
                        admin:isAdmin,
                        publisher:isAdvancer,
                        advancer:isPublisher});
                }else{
                    res.status(400).json({'status':false,error: 'Invalid user credentials'})
                }
                
            } else {
                res.status(400).json({'status':false,error: 'User not found, please register before trying to login'})
            }
            
        } catch (error:any) {
            res.status(400).json({error: error.message})   
           }
       }

    }
}

// register user
const register = async (req:any,res:any)=>{
    const  {
        email, 
        name,
        surname,
        password,
        countryCode} = req.body;
        // check that all inputs are filled
        if(!name||!surname||!email||!password||!countryCode){
            res.status(400).json({status:false,error: 'please add all fields'}) 
        }
        else
        {
          if(ValidateEmail(email)){
            const lowerCaseEmail = email.toLowerCase();
            // check password strength
                if(passwordStrength(password).value==='Too weak'||passwordStrength(password).value==='Weak')
                {
                    res.status(400).
                    json({
                    'status':false,
                    error: 'Your password is weak,It must be atleast 8 characters and contain lowercase, uppercase, symbol and/or number'})
                }
                else{
                //check if the user exists
                const userExists= await User.findOne({email:lowerCaseEmail})
                if (userExists) {
                res.status(400).json({status:false,error: 'user already exists'})
                }
                else
                {

                    // hash the password
                    const salt = await  bcrypt.genSalt(10);
                    const Hashedpassword = await bcrypt.hash(password,salt);
                    // console.log(req.body);
                    try {
                        const user = await User.create({name,surname,email:lowerCaseEmail,password:Hashedpassword,countryCode});
                        const freeplan = await planModel.findOne({planName:'Free Plan'});
                        const Regadvancer = await advancerProfile.create({userId:user._id,planId:freeplan._id});
                        const admin = await adminProfile.findOne({userId:user._id});
                        const advancer = await advancerProfile.findOne({userId:user._id});
                        const publisher = await publisherProfile.findOne({userId:user._id});
                        const isAdmin = admin?true:false;
                        const isAdvancer = advancer?true:false;
                        const isPublisher = publisher?true:false;
                        let role ={
                            admin:isAdmin,
                            publisher:isPublisher,
                            advancer:isAdvancer
                        }
                        res.status(200).
                        json( {status:true,
                            token:generateToken(user._id,user.name,
                                user.surname,user.email,user.countryCode,role,user.profilePicture),
                            email:user.email,
                            name:user.name,
                            surname:user.surname,
                            countryCode:user.countryCode});
                            
                            try {
                                const transporter = nodemailer.createTransport({
                                    host:'smtp.gmail.com',
                                    port:587,
                                    secure:false,
                                    requireTLS:true,
                                    auth:{
                                        user:"noreply@minorityafrica.org",
                                        pass:process.env.EMAILPASSWORD
                                    }
                                });
                                const mailOptions = {
                                    from:'noreply@minorityafrica.org',
                                    to:email,
                                    subject:'Welcome to Advance',
                                    html:'<p>Hi '+name+', Welcome to Advance, We are happy that you decided to join us on a journey to make Minority Voices be heard across Africa</p><br/><br/><p>The Advance team</p>'
                                 }
                                transporter.sendMail(mailOptions,function(error:any,info:any){
                                    if (error) {
                                        console.log(error);
                                        
                                    } else {
                                        console.log('message has been sent',info.response);
                                        
                                    }
                                })
                            } catch (error:any) {  
                                res.status(400).json({status:false,error: error.message})   
                                  
                            }
                    } catch (error:any) {
                        res.status(400).json({status:false,error: error.message})   
                    }

                }
            }

          }
          else{
            res.status(400).json({status:false,error: 'your email address is not valid'})
          }
     }
}

// register publisher
const registerPublisher = async (req:any,res:any)=>{
    const  {userId,organisation} = req.body;
          if(ObjectId.isValid(userId)){
                //check if the user exists
                const userExists= await publisherProfile.findOne({userId})
                if (userExists) {
                res.status(400).json({status:false,error: 'already registered as a publisher'})
                }
                else
                {
                    try {
                        const freeplan = await planModel.findOne({planName:'Free Plan'})
                        if (freeplan) {
                            try {
                                const publisher = await publisherProfile.create({userId,planId:freeplan._id,organisation});
                                const toEmail= "advance@minorityafrica.org";
                                const subject ="New Publisher Registration Application";
                                const html= '<p>Dear Advance Admin. '+userExists.name+' '+userExists.surme+', has just applied to be a publisher, Login to your Admin Dashboard now to approve the request</p><br/><p> Thanks</p>';
     
                                sendMail(toEmail,subject,html);
                                res.status(200).
                                json( {status:true,publisher:publisher});
                            } catch (error:any) {
                                res.status(400).json({status:false,error: error.message})   
                            }
                            
                        } else {
                            res.status(400).json({status:false,error: "The plan has not been added yet"}) 
                        }
                        
                    } catch (error:any) {
                        res.status(400).json({status:false,error: error.message})    
                    }

                }
            }
          else{
            res.status(400).json({status:false,error: 'the provided user Id is invalid'})
          }
     
}
//register advancer
const updateAdvancerProfile = async (req:any,res:any)=>{
    const  {userId,company,website,planId,applicationPassword,wordpressAdminName} = req.body;
          if(ObjectId.isValid(userId)){
                //check if the user existsplanModel
                try {
                    const advancer = await advancerProfile.findOneAndUpdate({userId},{planId,company,website,applicationPassword,wordpressAdminName});
                    res.status(200).json( {'status':true,advancer:advancer})    
                    } 
                    catch (error:any) {
                    res.status(400).json({status:false,error: error.message})     
                    } 
            }
          else{
            res.status(400).json({status:false,error: 'the provided user Id is invalid'})
          }
     
}

//upload any media file
const uploadMedia   = async (req:any,res:any) => {
    const containersArray = ['profile-pictures','article-images','article-videos',"article-content"]
    const {container,id} = req.body;
    const {originalname,buffer} = req.file;
    if (containersArray.includes(container)) {
        try { 
            const containerClient = BlobService.getContainerClient(container);
            const uniqueName = id+"/"+Date.now()+"/"+originalname;
            await containerClient.getBlockBlobClient(uniqueName).uploadData(buffer);

            if (container==='profile-pictures') {
                const pic = await User.findByIdAndUpdate(id,{$push:{"profilePicture":{name: uniqueName}}})
                   res.status(200).json( {'status':true,message:"Profile picture successfully added"})
                .catch((err:any)=>res.status(400).json({error: err.message}))   
                
            }else if(container==='article-content'){
                const pic = await articleModel.findByIdAndUpdate(id,{$push: {"articleContent":{
                       name: uniqueName}}})
                    res.status(200).json( {'status':true,message:"Article media successfully added"})
                .catch((err:any)=>res.status(400).json({error: err.message})) 
            }else{
                const pic = await articleModel.findByIdAndUpdate(id,{$push: {"articleMedia":{
                       name: uniqueName}}})
                    res.status(200).json( {'status':true,message:"Article media successfully added"})
                .catch((err:any)=>res.status(400).json({error: err.message})) 
            }
            }     
        catch (error:any) {
            res.status(400).json({error: error.message})   
           } 
        
    } else {
        res.status(400).json({error: 'choosen container is invalid, choose from (profile-pictures,article-images,article-videos,article-content)'})   
    }
}

const getUploadedMedia   = async (req:any,res:any) => {
    const containersArray = ['profile-pictures','article-images','article-videos',"article-content"]
    const {container,id} = req.params;
    if (containersArray.includes(container)) {
        try { 
            const containerClient = BlobService.getContainerClient(container);
            res.header("Content-Type","image/jpg")

            if (container==='profile-pictures') {
                try {
                    const filename = await profilePic.findOne({userId: id})
                
                    if(filename){
                        const response = await containerClient.getBlockBlobClient(filename.name).downloadToBuffer();
                        res.status(200).send(response)
    
                    }
                    else{
                        res.status(400).json({error: 'file not found'})
                    } 
                    
                } catch (error:any) {
                    res.status(400).json({error: error.message})
                }
                
            }else{
                try {
                    const filename = await MediaModel.findOne({articleId: id})
                
                    if(filename){
                        const response = await containerClient.getBlockBlobClient(filename.name).downloadToBuffer();
                        res.status(200).send(response)
    
                    }
                    else{
                        res.status(400).json({error: 'file not found'})
                    } 
                    
                } catch (error:any) {
                    res.status(400).json({error: error.message})
                }
            }
            }               
          catch (error:any) {
            res.status(400).json({error: error.message})   
           } 
        
    } else {
        res.status(400).json({error: 'choosen container is invalid, choose from (profile-pictures,article-images,article-videos,article-content)'})   
    }
}

//delete uploaded media
const deleteUploadedMedia   = async (req:any,res:any) => {
    const containersArray = ['profile-pictures','article-images','article-videos',"article-content"]
    const {container,filename,id} = req.params;
    if (containersArray.includes(container)) {
        try { 
            const containerClient = BlobService.getContainerClient(container);
            const response = await containerClient.getBlockBlobClient(filename).deleteIfExists();

            if (container==='profile-pictures') {
                const pic =  profilePic.findByIdAndUpdate(id,{$pull:{'profilePicture':{name:filename}}}); 
                    pic.save().then(()=>res.status(200).json( {'status':true,message:"Profile picture successfully deleted"}))
                .catch((err:any)=>res.status(400).json({error: err.message}))   
                
            }else if(container==='article-content'){
                const pic = articleModel.findAndUpdate(id,{$pull:{'articleContent':{name:filename}}});
                    pic.save().then(()=>res.status(200).json( {'status':true,message:"Article content successfully deleted"}))
                .catch((err:any)=>res.status(400).json({error: err.message}))
            }else{
                const pic = articleModel.findByIdAndUpdate(id,{$pull:{'articleMedia':{name:filename}}});
                    pic.save().then(()=>res.status(200).json( {'status':true,message:"Article media successfully deleted"}))
                .catch((err:any)=>res.status(400).json({error: err.message})) 
            }
            }               
         catch (error:any) {
            res.status(400).json({error: error.message})   
           } 
        
    } else {
        res.status(400).json({error: 'choosen container is invalid, choose from (profile-pictures,article-images,article-videos,article-content)'})   
    }
}

//update uploaded media
const updateUploadedMedia   = async (req:any,res:any) => {
    const containersArray = ['profile-pictures','article-images','article-videos']
    const {container,filename,id} = req.params;
    const {originalname,buffer} = req.file;
    if (containersArray.includes(container)) {
        try { 
            const containerClient = BlobService.getContainerClient(container);
             const uniqueName = id+"/"+Date.now()+"/"+originalname;
             const upload = await containerClient.getBlockBlobClient(uniqueName).uploadData(buffer);
             const response = await containerClient.getBlockBlobClient(filename).deleteIfExists();

            if (container==='profile-pictures') {
                const pic =  profilePic.findByIdAndUpdate(id,{$set:{"profilePicture.$.name":uniqueName}}); 
                    pic.save().then(()=>res.status(200).json( {'status':true,message:"Profile picture successfully deleted"}))
                .catch((err:any)=>res.status(400).json({error: err.message}))   
                
            }else if(container==='article-content'){
                const pic = articleModel.findOneAndUpdate({_id:id,"articleContent.$.name":filename},{$set:{"articleContent.$.name":uniqueName}});
                    pic.save().then(()=>res.status(200).json( {'status':true,message:"Article media successfully edited"}))
                .catch((err:any)=>res.status(400).json({error: err.message})) 
            }else{
                const pic = articleModel.findByIdAndUpdate(id,{$set:{"articleMedia.$.name":uniqueName}});
                    pic.save().then(()=>res.status(200).json( {'status':true,message:"Article media successfully edited"}))
                .catch((err:any)=>res.status(400).json({error: err.message})) 
            }
            }               
         catch (error:any) {
            res.status(400).json({error: error.message})   
           } 
        
    } else {
        res.status(400).json({error: 'choosen container is invalid, choose from (profile-pictures,article-images,article-videos,article-content)'})   
    }
}
//Forgot password
const forgotPassword = async (req:any,res:any)=>{
      const  {email} = req.body;
      try {
       const lowerCaseEmail = email.toLowerCase();
       const currentUser = await User.findOne({email:lowerCaseEmail});
       if(currentUser){
        var val = Math.floor(1000 + Math.random() * 9000);
        const generatedString = val.toString();
        const data = await User.updateOne({email:lowerCaseEmail},{$set:{passwordResetToken:generatedString}});
        const subject ='Reset password';
        const html = '<p>Hi '+currentUser.name+', You have requested to change your password. Here is the token, use it to reset your password:</p><a> '+generatedString+'</a>';
     
        sendMail(lowerCaseEmail,subject,html)
        res.status(200).json({status:true,message: 'please check your email inbox to complete the process'})
       }
       else{
        res.status(400).json({status:false,error: 'This email does not exist'})
       }
      } 
      catch (error:any) {
        res.status(400).json({status:false,error: error.message})      
      }
}
// deactivate admin account
const deactivateAccount = async (req:any,res:any)=>{
    const  {password,role} = req.body;
 // console.log(req.body);
    try {
        const user = await User.findById(req.params.id);
        if(user&&(await bcrypt.compare(password,user.password))){
            User.findByIdAndUpdate(req.params.id,{isAccountDeactivated:true}, function (err:any, admin:any) {
                if (err){
                    res.status(400).json({error: err.message}) 
                }
                else{
                    const lowerCaseEmail = user.email.toLowerCase();
                    const subject ='Deactivating Account';
                    const html ='<p>Hi '+user.name+', Your account has been deactivated, you are now an advancer, You will need to re apply to become a '+role+'</p>';
             
                    sendMail(lowerCaseEmail,subject,html);
                    res.status(200).json({status:true,success: 'successfully deactivated account',user:user})
                 }
                });
        }
        else{
            res.status(400).json({message:"password is incorrect, please use the correct password"})  
        }
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       }
}

// send contact us email to minority africa
const sendContactUsEmail = async (req:any,res:any)=>{
    const  {Fistname,Lastname,email,Content} = req.body;
    if(ValidateEmail(email)){
       const toEmail ="advance@minorityafrica.org" ;
       const subject ='New message from Advance' ;
       const html ='<h4>'+Fistname+' '+Lastname+'</h4><a href="mailto:"'+email+'>Email address: '+email+'</a></br><p>'+Content+'</p>' ;

       const sendEmail = await sendMail(toEmail,subject,html);

        res.status(200).json({message: 'message has been sent'})
       
    }else{
        res.status(400).json({error:'invalid email address'});
    }
}
// send news letter email to minority africa
const subscribeToNewsLetterEmail = async (req:any,res:any)=>{
    const  {email} = req.body;
    if(ValidateEmail(email)){
       const toEmail ="advance@minorityafrica.org" ;
       const subject ='New subscriber to news letters' ;
       const html ='</h4><a href="mailto:"'+email+'>Email address: '+email ;

       const sendEmail = await sendMail(toEmail,subject,html);

        res.status(200).json({message: 'message has been sent'})
       
    }else{
        res.status(400).json({error:'invalid email address'});
    }
}
// deactivate admin account
const sendDeleteAccountToken = async (req:any,res:any)=>{
    const  {email} = req.body;
    try {
     const lowerCaseEmail = email.toLowerCase();
     const currentUser = await User.findOne({email:lowerCaseEmail});
     if(currentUser){
      var val = Math.floor(1000 + Math.random() * 9000);
      const generatedString = val.toString();
      const data = await User.updateOne({email:lowerCaseEmail},{$set:{deleteAccountToken:generatedString}});


      const subject = 'Delete Account';
      const html ='<p>Hi '+currentUser.name+', You have requested to delete your account. Here is the token, use it to delete your account:</p><a> '+generatedString+'</a>'

      const sendEmail = await sendMail(lowerCaseEmail,subject,html);

      res.status(200).json({status:true,message: 'please check your email inbox to complete the process'})
     }
     else{
      res.status(400).json({status:false,error: 'This email does not exist'})
     }
    } 
    catch (error:any) {
      res.status(400).json({status:false,error: error.message})      
    }
 }

// deactivate admin account
const deleteAccount = async (req:any,res:any)=>{
    try {
     const token = req.query.token;
     const tokenData = await User.findOne({deleteAccountToken:token});
     if(tokenData){
        // hash the password
        const deleteAcc = await User.findByIdAndDelete({_id:tokenData._id});
      
        res.status(200).json({status:true,message: 'User deleted successfully'})
     }
     else{
      res.status(400).json({status:false,error: 'The token is invalid'})
     }
    } 
    catch (error:any) {
      res.status(400).json({status:false,error: error.message})      
    }
}
//reset password
const resetPassword = async (req:any,res:any)=>{
    const  {password} = req.body;
    if(passwordStrength(password).value==='Too weak'||passwordStrength(password).value==='Weak')
    {
        res.status(400).json({'status':false,error: 'Your password is weak,it must be atleast 8 charecters and contain lowercase, uppercase, symbol and/or number'});
    }else{
    try {
     const token = req.query.token;
     const tokenData = await User.findOne({passwordResetToken:token});
     if(tokenData){
        // hash the password
        const salt = await  bcrypt.genSalt(10);
        const NewHashedpassword = await bcrypt.hash(password,salt);
        const setPassword = await User.findByIdAndUpdate({_id:tokenData._id},{$set:{password:NewHashedpassword,passwordResetToken:""}},{new:true});
      
        res.status(200).json({status:true,message: 'User password has been reset successfully',data:setPassword})
     }
     else{
      res.status(400).json({status:false,error: 'The token is invalid'})
     }
    } 
    catch (error:any) {
      res.status(400).json({status:false,error: error.message})      
    }
  }
}
// 
const welcome =(req:any,res:any)=>{
    res.status(200).json({status:true,error: 'welcome to minority backed'})
}
// validate email
function ValidateEmail(inputText:any)
    {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(inputText.match(mailformat))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
// Generate token
const generateToken = (userId:any,firstName:any,
    lastName:any,email:any,countryCode:any,role:any,profilePic:any)=>{
    return jwt.sign({userId,firstName,lastName,email,countryCode,role,profilePic},process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
}

//for many
module.exports = {
    register,logIn,welcome,forgotPassword,resetPassword,authenticateGoogleUser,getUploadedMedia,deleteUploadedMedia,
    registerPublisher,updateAdvancerProfile,updatePassword,uploadMedia,updateUploadedMedia,
    deactivateAccount,sendDeleteAccountToken,deleteAccount,sendContactUsEmail,subscribeToNewsLetterEmail,
    GetGoogleTokens,GetGoogleCredentials
}