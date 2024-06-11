const mongoose= require("mongoose")

const Schema = new mongoose.Schema({
    fullname:{
        type:String,
        required :true
    },
    email:{
        type:String,
        required :true
    },
    password:{
        type:String,
        required :true
    },
    createdOn:{
        type:Date,
        default : new Date().getTimer()
    },
})

module.exports = mongoose.model("User",Schema);