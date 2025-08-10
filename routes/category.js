const express = require('express');
const router = express.Router();
const Category = require('../models/categorySchema');

router.post('/post', async(req, res)=>{
    try{
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    }catch(err){
        console.error("new Category Add Failed!");
        res.status(500).json({error:"Failed to add new Category"});
    }
})

router.get('/get/:userId', async(req, res)=>{
    try{
        const category = await Category.find({userId: req.params.userId});
        res.status(200).json(category);
    }catch(err){
        console.error("Error in get Category : ",err);
        res.status(500).json({error: "Failed to Fetch Category"});
    }
})

module.exports = router;