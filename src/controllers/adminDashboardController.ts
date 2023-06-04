const User = require('../models/userModel');
const advancerProfile = require('../models/advancerModel')
const publisherProfile = require('../models/publisherModel')
const adminProfile = require('../models/adminModel')
const nodemailer = require('nodemailer')
var ObjectId = require('mongoose').Types.ObjectId;
export{}

//getPublishers 
const getPublishers = async (req:any,res:any)=>{
    // console.log(req.body);
    try {
        const currentUser = await publisherProfile.aggregate([  
            { $lookup:
               {
                 from: 'users',
                 localField: 'userId',
                 foreignField: '_id',
                 as: 'publisherInfo'
               }
             }, 
             {$sort: {"createdAt": -1}},
             { $lookup:
                {
                  from: 'plans',
                  localField: 'planId',
                  foreignField: '_id',
                  as: 'planInfo'
                }
              }]);
        if(!currentUser){
            res.status(400).json({error: "users not found"})
        }
        res.status(200).json( {'status':true,list:currentUser});
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       }        
  }

// getAdvancers
const getAdvancers = async (req:any,res:any) => {
    // console.log(req.body);
    try {
        const currentUser = await advancerProfile.aggregate([  
            { $lookup:
               {
                 from: 'users',
                 localField: 'userId',
                 foreignField: '_id',
                 as: 'advancerInfo'
               }
             }, 
             { $lookup:
                {
                  from: 'plans',
                  localField: 'planId',
                  foreignField: '_id',
                  as: 'planInfo'
                }
              }]);
        if(!currentUser){
            res.status(400).json({error: "users not found"})
        }
        res.status(200).json( {'status':true,list:currentUser});    
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}
// getAdvancers
const getAdmins = async (req:any,res:any) => {
    // console.log(req.body);
    try {
        const currentUser = await adminProfile.aggregate([  
            { $lookup:
               {
                 from: 'users',
                 localField: 'userId',
                 foreignField: '_id',
                 as: 'adminInfo'
               }
             }]);
        if(!currentUser){
            res.status(400).json({error: "users not found"})
        }
        res.status(200).json( {'status':true,list:currentUser});    
    } 
    catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}
// approve
const approvePublisher = async (req:any,res:any) => {
        try {
            const document = await publisherProfile.findOneAndUpdate({userId:req.params.id},{ status: 'approved'});
            const currentUser = await User.findById(req.params.id);

            if(ValidateEmail(currentUser.email)){
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
                        to:currentUser.email,
                        subject:"Approval to become a publisher ",
                        html:"<p>Your Request to be a publisher on Minority Africa Advance has been approved, Please logout and Login to access the Publisher Dashboard<br/><br/><br/>The Advance Team</p>"
                     }
                    transporter.sendMail(mailOptions,function(error:any,info:any){
                        if (error) {
                            res.status(400).json({status:false,error:error});
                            
                        } else {
                            res.status(200).json( {'status':true,'message':'succefully approved publisher'});
                            
                        }
                    })
                } catch (error:any) {  
                    res.status(400).json({status:false,error:error});     
                }
            }
            else{
                res.status(400).json({status:false,error: 'didnt find a valid email address but the the publisher is approved'})
            }
            
        } catch (error:any) {
            res.status(400).json({error: error.message})   
           } 
}
//suspend advancer
const suspendAdvancer = async (req:any,res:any) => {
    try {
        const document = await advancerProfile.findOneAndUpdate({userId:req.params.id}, 
            { status: 'suspended'});
        
        res.status(200).json( {'status':true,'message':'succefully suspended advancer'});
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}

// get admin profile info
const getAdminProfile = async (req:any,res:any)=>{
    // console.log(req.body);
 if(ObjectId.isValid(req.params.id)){
    try {
        const currentUser = await User.findById(req.params.id).select('-password');
        if(currentUser){
            const admin = await adminProfile.find({ userId:currentUser._id });
            if(admin){
                res.status(200).json( {'status':true,'user':currentUser,'admin Info':admin});
            }
            else{
            res.status(400).json({error: "user is not the admin"})
            }
        }
        else{
            res.status(400).json({error: "user not found"})
        }
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       } }
       else{
        res.status(400).json({status:false,error: 'the provided user Id is invalid'})
    }
}

// get admin profile info
const updateProfile = async (req:any,res:any)=>{
    const  {
        email, 
        name,
        surname,
        location,
        phoneNumber} = req.body;
    // console.log(req.body);
 if(ObjectId.isValid(req.params.id)){
    const lowerCaseEmail = email.toLowerCase();
    try {
        const currentUser = await User.findByIdAndUpdate(req.params.id,{name:name,surname:surname,email:lowerCaseEmail}).select('-password');
        if(currentUser){
         res.status(200).json( {'status':true,'user':{email,name,surname,location,phoneNumber},message:'successfully updated the user info'});
        }
        else{
            res.status(400).json({error: "user not found"})
        }
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       } }
       else{
        res.status(400).json({status:false,error: 'the provided user Id is invalid'})
    }
}

//register admin
const addAdmin = async (req:any,res:any)=>{
    const  {email,phoneNumber,description} = req.body;
     const lowerCaseEmail = email.toLowerCase();
                //check if the user exists
                const user = await User.findOne({email:lowerCaseEmail})
                if(user){
                    const userExists = await adminProfile.findOne({userId:user.id})
                    if (userExists) {
                     res.status(400).json({status:false,error: 'already registered as a admin',userExists})
                    }
                    else
                    {
                        // hash the password
                        try {
                            const admin = await adminProfile.create(
                                {   userId:user._id,
                                    phoneNumber:phoneNumber,
                                    location:user.countryCode,
                                    description:description
                                });
                            res.status(200).
                            json( {status:true,admin:admin});
                        } catch (error:any) {
                            res.status(400).json({status:false,error: error.message})   
                        }
    
                    }

                }
                else{
                    res.status(400).json({status:false,error:'The user is not registered in the system'})  
                }
            }



// revoke
const revokePublisher = async (req:any,res:any) => {
    try {
        const document = await publisherProfile.findOneAndUpdate({userId:req.params.id}, 
            { status: 'rejected'});
        

        res.status(200).json( {'status':true,'message':'succefully approved publisher'});
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
 }
//switching to the publisher profile
const switchToPublisher = async (req:any,res:any) => {
    try {
        const user = await publisherProfile.findOne({userId:req.params.id})
        if(user){
            res.status(200).json( {'status':true,'message':"is publisher"});
        }
        else{
            res.status(400).json( {'status':false,'message':'not publisher'});
        }
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}
//switching to the admin profile
const switchToAdmin = async (req:any,res:any) => {
    try {
        const user = await adminProfile.findOne({userId:req.params.id})
        if(user){
            res.status(200).json( {'status':true,'message':"is admin"});
        }
        else{
            res.status(400).json( {'status':false,'message':'not admin'});
        }
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}

// make super admin
const makeSuperAdmin = async (req:any,res:any) => {
    try {
        const document = await adminProfile.findOneAndUpdate({userId:req.params.id}, 
            { isSuperAdmin: true});
        res.status(200).json( {'status':true,'message':'succefully made the admin a super admin'});
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       } 
}

// sendEmailTo
const sendEmailTo = async (req:any,res:any) => {
    const { recieverMail, message,subject } = req.body;
    
    if(ValidateEmail(recieverMail)){
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
                to:recieverMail,
                subject:subject,
                html:'<p>'+message+'</p>'
             }
            transporter.sendMail(mailOptions,function(error:any,info:any){
                if (error) {
                    res.status(400).json({status:false,error:error});
                    
                } else {
                    res.status(200).json({status:true,message: 'message has been sent'})
                    
                }
            })
        } catch (error:any) {  
            res.status(400).json({status:false,error:error});     
        }
    }
    else{
        res.status(400).json({status:false,error: 'your email address is not valid'})
    }


}
// sendEmailTo
const sendPublisherApprovalEmail = async (req:any,res:any) => {
    const { recieverMail, message,subject } = req.body;
    
    if(ValidateEmail(recieverMail)){
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
                to:recieverMail,
                subject:"Approval to become a publisher ",
                html:"<p>Your Request to be a publisher on Minority Africa Advance has been approved, Please logout and Login to access the Publisher Dashboard<br/><br/><br/>The Advance Team</p>"
             }
            transporter.sendMail(mailOptions,function(error:any,info:any){
                if (error) {
                    res.status(400).json({status:false,error:error});
                    
                } else {
                    res.status(200).json({status:true,message: 'message has been sent'})
                    
                }
            })
        } catch (error:any) {  
            res.status(400).json({status:false,error:error});     
        }
    }
    else{
        res.status(400).json({status:false,error: 'your email address is not valid'})
    }


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

//for many
module.exports = {
    getAdvancers,getPublishers,approvePublisher,revokePublisher,sendEmailTo,switchToPublisher,
    getAdmins,getAdminProfile,updateProfile,addAdmin,makeSuperAdmin,switchToAdmin,suspendAdvancer
}