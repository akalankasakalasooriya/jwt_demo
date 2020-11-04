require('dotenv').config()
const express  = require('express')
const app = express()
app.use(express.json());
const jwt = require('jsonwebtoken')
const { restart } = require('nodemon')
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.get('/db',(req,res)=>{
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        dbo.collection("items").find({}).toArray(function(err, result) {
          if (err) throw err;
          res.json(result)
          db.close();
        });
      });
   
})




const post = [
    {
        username:'akalanka',
        title:'post 1'
    },
    {
        username:'himesha',
        title:'post 2'
    }
]

app.get('/post',authenticateToken,(req,res)=>{
    console.log(req.user)
    res.json(post.filter(post => post.username === req.user.name))
})

app.post('/login',jsonParser,(req,res)=>{
    //authentication
    const username = req.body.username
    const user = { name: username }
   
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_KEY)
    res.json({accessToken: accessToken})

})

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token,process.env.ACCESS_TOKEN_KEY,(err,user)=>{
        if(err) res.sendStatus(403)
        req.user = user
        
        next()
    })
}

app.post('/logout',jsonParser,(req,res)=>{
    //authentication
   
    res.json({accessToken: null})

})

app.listen(3000)
//console.log("hi")