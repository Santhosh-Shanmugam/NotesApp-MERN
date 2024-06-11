const express = require("express")
const app = express()


const dotenv = require("dotenv")
dotenv.config()

const config = require("./config.json");

const mongoose=require("mongoose");
mongoose.connect(config.connectionString);

const User = require("./models/user.model.js");
const Note = require("./models/note.model.js");


const cors = require("cors")

const jwt = require("jsonwebtoken");
const {authenticationToken} = require("./utils");

app.use(express.json())

app.use(
    cors({
        origin : "*",
    })
)


app.get("/",(req,res)=>{
    res.json({date:"hello"})
})

app.post("/create-account",async(req,res)=>{
    const {fullName , email , password } = req.body;

    if(!fullName) return res.status(400).json({error : true , message:"Full Name is required"});

    if(!email) return res.status(400).json({error:true , message:"Email is required"});

    if(!password) return res.status(400).json({error:true , message:"Password is required"});
    
    const isUser = await User.findOne({email: email});

    if(isUser) {
        return res.json({
            error : true,
            message : "User already exists",
        })
    }

    const user = new User({
        fullName,
        email,
        password,
    })

    await user.save();

    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "3600m",
    })

    return res.json({
        error:false,
        user,
        accessToken,
        message: "Registered Successfull",
    })
})

app.post("/login", async(req,res)=>{
    const { email , password } = req.body;

    if(!email) return res.status(400).json({message: "Email is required"});

    if(!password) return res.status(400).json({message:"Password is required"});

    const userinfo = await User.findOne({email:email});

    if(!userinfo)   return res.status(400).json({ message : "user not found" });

    if(userinfo.email == email  && userinfo.password == password) 
    {
        const user = { user : userinfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn:"36000m",
        });

        return res.json({
            error:false,
            message : "Login Succesfully",
            email,
            accessToken,
        });
    } 
    else 
    {
        return res.status(400).json({
            error:true,
            message : "Invalid Credntails",
        });
    }
});

app.post("/add-note",authenticationToken,async(req,res)=>{
     const {title, content ,tags} = req.body;
     const {user} = req.user;

     if(!title) return res.status(400).json({message: "Title is required"});

     if(!content) return res.status(400).json({message: "Content is required"});

     try{
        const note = new Note({
            title,
            content,
            tags : tags || [],
            userId : user._id,

        });

        await note.save();

        return res.json({
            error : false,
            note,
            message: " note added succesfully",
        })
     }
     catch(error) {
        return res.status(500).json({
            error:true,
            message: "Internal server error",

        })
     }

})


app.listen(`${process.env.port}` , ()=>{
    console.log(`Server Started at ${process.env.port}`);
})

module.exports = app;