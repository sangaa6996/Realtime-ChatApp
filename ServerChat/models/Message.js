var mongoose= require('mongoose');

var schemaMessage= new mongoose.Schema({
    room:String,
    text:String,
    user:String
})

module.exports=mongoose.model("Message",schemaMessage)