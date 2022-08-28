const mongoose = require("mongoose");
const userModel = require('./userModel')

const quesSchema = mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: userModel,
  },
  price:{
    type:Number,
    required:true
  },
  purpose:{
    type:String,
    enums:['Others' , 'Food' , 'Shopping' , 'Travel'],
    default:'Others'
  },
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  
}, {
  timestamps: true
});
module.exports = mongoose.model("expenses", quesSchema);