const mongoose =require("mongoose")

const rsvpSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,ref:"User"
    },
    event:{
        type:mongoose.Schema.Types.ObjectId,ref:"Event"
    },

})

rsvpSchema.index({user:1,event:1},{unique:true})

const rsvp= mongoose.model("RSVP",rsvpSchema)

module.exports=rsvp
