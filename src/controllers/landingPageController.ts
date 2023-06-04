
const articleModel = require('../models/articleModel')
const advancerProfile = require('../models/advancerModel')
const publisherProfile = require('../models/publisherModel')
export{}

//get number of read article monthly
const getNoMonthlyReads = async (req:any,res:any) => {
    const d = new Date();
    let month = d.getMonth();
    
    try {
        articleModel.countDocuments({ "reads": { month: month},"metrics.read":{$gt:0} },function (err:any, count:any) {
            if (err) res.status(400).json({error: err.message})
               else res.status(200).json( {'status':true,count:count});
           });
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       }

}

//get the number of advancers

const getNoAdvancers = async (req:any,res:any) => {
    try {
        advancerProfile.countDocuments({ "status": "approved" },function (err:any, count:any) {
            if (err) res.status(400).json({error: err.message})
               else res.status(200).json( {'status':true,count:count});
           });
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       }

}
//get the number of publishers

const getNoPublishers = async (req:any,res:any) => {
    try {
        publisherProfile.countDocuments({ "status": "approved" },function (err:any, count:any) {
            if (err) res.status(400).json({error: err.message})
               else res.status(200).json( {'status':true,count:count});
           });
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       }

}
//get the number of publishers

const getNoArticles = async (req:any,res:any) => {
    try {
        articleModel.countDocuments({ "state": "published" },function (err:any, count:any) {
            if (err) res.status(400).json({error: err.message})
               else res.status(200).json( {'status':true,count:count});
           });
        
    } catch (error:any) {
        res.status(400).json({error: error.message})   
       }

}
//for many
module.exports = {getNoMonthlyReads,getNoAdvancers,getNoPublishers,getNoArticles}