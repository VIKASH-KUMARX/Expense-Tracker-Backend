const express = require('express')
const router = express.Router()
const Login = require('../models/loginSchema') 
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcrypt'); 

router.get('/' ,(req, res)=>{
    res.send("Hellllo world from home of login");
})

const transport = nodemailer.createTransport({
  service:"gmail",
  // port:465,
  // secure:true,
  auth:{
    user:"teamproject8080@gmail.com",
    pass:"qfxbzfyogwjwehbo"
  }
})

router.post('/signup', async(req, res)=>{
  try{
    console.log(req.body);
    const { username, email, password } = req.body;

    const user = await Login.findOne({email});
    if(user) return res.status(400).json({error: "Gmail Alrady Exists"})

    const activationToken = jwt.sign({email}, process.env.JWT_SECURE_CODE, {expiresIn:'1h'});
    const mailOptions = {
      from : 'teamproject8080@gmail.com',
      to: email,
      subject: "Verify your gmail for Expe",
      html: `
      <h1>Hello ${username}</h1>
      <a href="http://localhost:5000/login/activate/${activationToken}">Click here to verify</a>
      `,
    }
    transport.sendMail(mailOptions, async(err, succ)=>{
      if(err){
        console.error("Activation mail not sent : ",err);
        res.status(400).json({error :"Activation mail not sent"});
      }
      else{
        try{
          const hashedPassword = await bycrypt.hash(password, 10);
          const user = new Login({username, email, password: hashedPassword, activationToken});
          await user.save();
          res.status(201).json({message: "SignedUp successfully"});
        }catch(err){
          console.err("User not Stored");
          res.status(500).json({error:"Failed to store user in DB!"})
        }
      }
    })
  }catch(err){
    console.error("Signup Failed : ",err);
    res.status(500).json({error:"Signup Failed, Enter Valid Gmail"});
  }
})

router.get('/activate/:activationToken', async(req, res)=>{
  try{
      const { activationToken } = req.params;
      const decodedToken = jwt.verify(activationToken, process.env.JWT_SECURE_CODE);
      const user = await Login.findOneAndUpdate(
      {email: decodedToken.email},
      {$set:{
        isActivated:true,
        activationToken:null
      }}
    );
    if(!user) return res.status(400).json({error:"Email Activation Failed!"})
    res.status(200).send({message:"Activated Successfully"})
  }catch(err){
    console.error("Failed to Activate");
    if(err==="TokenExpiredError") return res.status(400).send({message: "Token Expired Try again!"})
    res.status(500).json({error:`${err} : Failed to activate!`});
  }
})

router.post('/checklogin', async(req, res)=>{
    try{
        const { email, password } = req.body;
    
        const user = await Login.findOne({email});
        if(!user) return res.status(404).json({ error : "User not found"});

        const decodedPassword = await bycrypt.compare(password, user.password);
        if(!decodedPassword) return res.status(401).json({ error : "Invalid Password"});
        if(!user.isActivated) return res.status(403).json({ error : "Please Verify Your Gmail"});

        console.log(user);
        res.status(200).json({
            userId : user._id,
            username : user.username,
            email : user.email
        });
    }catch(err){
        console.error("Login failed : ", err);
        res.status(500).json({ error : "login Failed"})
    }
})

// router.get('/get', async(req, res)=>{
//     try{
//         const users = await Login.find(req.params.id)
//         console.log(users)
//         res.status(200).json(users);
//     }
//     catch{
//         console.error("User not Found")
//         res.status(500).send("User not Found")
//     }
// })

// router.get('/get/:id', async(req, res)=>{
//     try{
//         const user = await Login.findById(req.params.id)
//         console.log(user)
//         res.status(200).json(user);
//     }
//     catch{
//         console.error("User Id not Found in get")
//         res.status(500).send("User Id not Found in get")
//     }
// })

// router.put('/update/:id', async(req, res)=>{
//     try{
//         const user = await Login.findByIdAndUpdate(req.params.id,req.body,{new:true})
//         console.log(user)
//         res.status(200).json(user);
//     }
//     catch{
//         console.error("User Id not Found in update")
//         res.status(500).send("User Id not Found in update")
//     }
// })

router.delete('/delete/:userId', async(req, res)=>{
    try{
        const user = await Login.findByIdAndDelete(req.params.userId);
        res.status(200).json(user);
    }
    catch{
        console.error("User Id not Found in delete")
        res.status(500).json({error: "User Id not Found in delete"})
    }
})

module.exports = router