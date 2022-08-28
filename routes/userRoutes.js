const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')

const jwt_token = process.env.JWT_SECRET;

const hashPassword = async(password) => {
        const salt = await  bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(password, salt);
        return (hashedPassword);
}
const jwtCode = async(id) => {
        const userToken =await jwt.sign({ id }, jwt_token);
        return (userToken);
}




router.post('/signup' ,async(req,res) => {
    try {
      let user = await userModel.findOne({email:req.body.email});
      if(user) return res.status(400).send({status:false, msg:'User Alread Exist!'})
      let pass = await hashPassword(req.body.password)
      user = await userModel.create({...req.body , password:pass})
      const userToken = await jwtCode(user.id);
      return res.status(200).send({status:true,msg:'User Created Successfully!' ,user , userToken})
    } catch (error) {
       
      res.status(500).send({status:false,msg:'Internal Server Error!'})
    }
  })
  router.post('/login' ,async(req,res) => {
    try {
      let user = await userModel.findOne({email:req.body.email});
      if(!user || !bcrypt.compareSync(req.body.password, user.password)) return res.status(404).send({status:false, msg:'Invalid Credentials!'})
      const userToken = await jwtCode(user.id);
      return res.status(200).send({status:true,msg:'Logged in Successfully!' , user , userToken})
    } catch (error) {
        console.log(error)
      res.status(500).send({status:false,msg:'Internal Server Error!'})
    }
  })
  router.get('/users' , async(req,res) => {
    let user = await userModel.find();
    return res.status(200).send({status:true,msg:'Fetched Successfully!' , user})
  })


module.exports = router;