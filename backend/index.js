const express = require("express")
const app = express()


const dotenv = require("dotenv")
dotenv.config()


const cors = require("cors")

app.use(express.json())

app.use(
    cors({
        origin : "*",
    })
)


app.get("/",(req,res)=>{
    res.json({date:"hello"})
})
app.listen(8080,()=>{
    console.log(`Server Started at ${process.env.port}`);
})

module.exports = app;