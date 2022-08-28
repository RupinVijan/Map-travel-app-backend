const mongoose = require("mongoose");

const quesSchema = mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  longitude:{
    type:String,
    required:true
  },
  latitude:{
    type:String,
    required:true
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
module.exports = mongoose.model("locations", quesSchema);