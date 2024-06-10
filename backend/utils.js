const jwt = require("jsonwebtoken")

function authenticationToken(req,res,next)
{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split("")[1];

    if(!token) return res.sendStatus(401);

    jwt.verify(token, process.env)
}