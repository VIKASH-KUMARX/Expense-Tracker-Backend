const express = require('express');
const router = express.Router();
const Source = require('../models/sourceSchema');

router.post('/post', async(req, res)=>{
    try{
        const source = new Source(req.body);
        await source.save();
        res.status(201).json(source);
    }catch(err){
        console.error("new Source Add Failed!");
        res.status(500).json({error:"Failed to add new Source"});
    }
})

router.get('/get/:userId', async(req, res)=>{
    try{
        const sources = await Source.find({userId: req.params.userId});
        res.status(200).json(sources);
    }catch(err){
        console.error("Error in get sources : ",err);
        res.status(500).json({error: "Failed to Fetch source"});
    }
})

module.exports = router;