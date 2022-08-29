const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require('../models/userModel')
const locationModel = require('../models/expenseModel')

const jwt_token = process.env.JWT_SECRET;

router.post('/expense' ,async(req,res) => {
    try {
        const userToken = jwt.verify(req.headers.usertoken, jwt_token);
      let user = await userModel.findById(userToken.id);
      if(!user) return res.status(404).send({status:false, msg:'Invalid Credentials!'})
      let location = await locationModel.create({...req.body , user:userToken.id})
      return res.status(200).send({status:true,msg:'Expenses Added Successfully!' , location})
    } catch (error) {
      console.log(error)
      res.status(500).send({status:false,msg:'Internal Server Error!'})
    }
  })
  router.get('/expense' , async(req,res) => {
    let user = await locationModel.find();
    return res.status(200).send({status:true,msg:'Fetched Successfully!' , user})
  })
  router.get('/expense/byUser' , async(req,res) => {
    const userToken = jwt.verify(req.headers.usertoken, jwt_token);
    let user = await locationModel.find({user:userToken.id}).populate('user');
    return res.status(200).send({status:true,msg:'Fetched Successfully!' , user})
  })
  router.get('/expense/byUser/filter' , async(req,res) => {
    const userToken = jwt.verify(req.headers.usertoken, jwt_token);
    let user = await locationModel.find({user:userToken.id});
    if(!user) return res.status(404).send({status:false , msg:'Auth Error!'});
    let toSearch;
    req.query.search?toSearch = req.query.search : toSearch = 'Food' 
    user = await locationModel.find({user:userToken.id , purpose : toSearch});
    return res.status(200).send({status:true,msg:'Fetched Successfully!' , user})
  })
router.delete('/expense/:id' , async(req,res) => {
  try {
    const expenseToFind = await locationModel.findById(req.params.id);
    if(!expenseToFind) return res.status(404).send({status:false, msg:'Request Not Valid!'})
    await locationModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({status:true,msg:'Deleted Successfully!' })
  } catch (error) {
    res.status(500).send({status:false,msg:'Internal Server Error!'})
  }
})



module.exports = router;