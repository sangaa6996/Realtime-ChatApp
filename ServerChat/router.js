const express=require('express');
const router=express.Router();
const Message= require('./models/Message')
const cors=require('cors')

router.use(cors());

router.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});

router.get('/',(req,res)=>{
    Message.find(function(err,data){
        if(err){
            res.json({'kq':0,'errMsg':err})
        }
        else{
            res.json(data)
        }
    })
})

router.get('/:room',(req,res)=>{
    Message.find(function(err,data){
        var room=req.params.room
        if(err){
            res.json({'kq':0,'errMsg':err})
        }
        else{
            var x=data.filter((message)=>message.room===room)
            res.json(x)
        }
    })
})

module.exports=router;