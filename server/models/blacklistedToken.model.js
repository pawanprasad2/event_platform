const mongoose = require("mongoose")

const blacklistToken=new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unquie:true
    },
    createAt:{
        type:Date,
        default:Date.now,
        expires:86400 //24hrs in seconds

    }
})

module.exports=mongoose.model("BlacklistToken",blacklistToken)