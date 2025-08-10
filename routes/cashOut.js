const express = require('express')
const router = express.Router()
const CashOut = require('../models/cashOutSchema')

router.post('/post', async(req, res)=>{
    try{
        const newCashOut = new CashOut(req.body);
        await newCashOut.save();
        res.status(201).json(newCashOut);
    }catch(err){
        console.error("Error in adding new Cashout",err);
        res.status(500).json({error: "Add new Cashout Failed!"});
    }
})

router.get('/get/:userId', async(req,res)=>{
    try{
        const cashouts = await CashOut.find({ userId:req.params.userId });
        res.status(200).json(cashouts);
    }
    catch(err){
        console.error("Error in get Cashout Data : ",err);
        res.status(500).json({error: "Failed to fetch cashouts"});
    }
});

router.get('/get/:id/:userId', async(req, res)=>{
    try{
        const cashout = await CashOut.findOne({_id:req.params.id, userId:req.params.userId});
        res.status(200).json(cashout);
    }catch(err){
        console.error("Error in Cashout getById");
        res.status(500).json({error:"Failed to fetch Cashout By Id"})
    }
})

router.put('/put/:id/:userId', async(req,res)=>{
    try{
        const cashouts = await CashOut.findOneAndUpdate({_id:req.params.id, userId:req.params.userId}, req.body, {new:true});
        if(!cashouts) return res.status(404).json({error:"Entry not found"});
        res.status(200).json(cashouts);
    }catch(err){
        console.error("Erron in update Cashout");
        res.status(500).json({error:"Failed to update Cashout"})
    }
})

router.delete('/delete/:id/:userId', async(req, res)=>{
    try{
        const { id, userId } = req.params;
        const cashout = await CashOut.findOneAndDelete({_id: id, userId});
        res.status(200).json(cashout);
    }catch(err){
        console.log("Cashin delete Failed!");
        res.status(500).json({error: "Cashin Delete Failed!"});
    }
})

module.exports = router;