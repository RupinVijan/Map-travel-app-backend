const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require('../models/userModel')
const locationModel = require('../models/locationModel')

const jwt_token = process.env.JWT_SECRET;

const jwtDecode = async(token) => {
    const userToken = jwt.verify(token, jwt_token);
    return (userToken.id);
}

router.post('/location' ,async(req,res) => {
    try {
        const userToken = jwtDecode(req.headers.userToken);
      let user = await userModel.findById(userToken);
      if(!user) return res.status(404).send({status:false, msg:'Invalid Credentials!'})
      let location = await locationModel.create({...req.body , user:userToken})
      return res.status(200).send({status:true,msg:'Location Added Successfully!' , location})
    } catch (error) {
      res.status(500).send({status:false,msg:'Internal Server Error!'})
    }
  })
  router.get('/location' , async(req,res) => {
    let user = await locationModel.find();
    return res.status(200).send({status:true,msg:'Fetched Successfully!' , user})
  })





module.exports = router;