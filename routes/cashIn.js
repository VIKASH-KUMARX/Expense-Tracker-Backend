const express = require('express')
const router = express.Router()
const CashIn = require('../models/cashInSchema')

router.post('/post', async(req, res)=>{
    try{
        const newCashIn = new CashIn(req.body);
        await newCashIn.save();
        res.status(201).json(newCashIn);
    }catch(err){
        console.error("Error in adding new Cashin",err);
        res.status(500).json({error: "Add new Cashin Failed!"});
    }
})

router.get('/get/:userId', async(req,res)=>{
    try{
        const cashins = await CashIn.find({ userId:req.params.userId });
        res.status(200).json(cashins);
    }
    catch(err){
        console.error("Error in get Cashin Data : ",err);
        res.status(500).json({error: "Failed to fetch cashins"});
    }
});

router.get('/get/:id/:userId', async(req, res)=>{
    try{
        const cashin = await CashIn.findOne({_id:req.params.id, userId:req.params.userId});
        res.status(200).json(cashin);
    }catch(err){
        console.error("Error in Cashin getById");
        res.status(500).json({error:"Failed to fetch Cashin By Id"})
    }
})

router.put('/put/:id/:userId', async(req,res)=>{
    try{
        const cashins = await CashIn.findOneAndUpdate({_id:req.params.id, userId:req.params.userId}, req.body, {new:true});
        if(!cashins) return res.status(404).json({error:"Entry not found"});
        res.status(200).json(cashins);
    }catch(err){
        console.error("Erron in update Cashin");
        res.status(500).json({error:"Failed to update Cashin"})
    }
})

router.delete('/delete/:id/:userId', async(req, res)=>{
    try{
        const { id, userId } = req.params;
        const cashin = await CashIn.findOneAndDelete({_id: id, userId});
        res.status(200).json(cashin);
    }catch(err){
        console.log("Cashin delete Failed!");
        res.status(500).json({error: "Cashin Delete Failed!"});
    }
})

module.exports = router;