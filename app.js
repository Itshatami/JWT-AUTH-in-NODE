const express = require('express');
const {PrismaClient} = require('@prisma/client')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const {createTokens , validateToken} = require('./jwt')

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.post('/register' , async (req,res)=>{
   const username = req.body.username;
   const password = req.body.password;
   const nPassword = await bcrypt.hash(password.toString() , 10)
   try {
      await prisma.user.create({
      data:{
         username:username,
         password: nPassword
      }
   })
   } catch (error) {
      res.status(400).json(error)
   }
   
   res.json('created')
})
app.post('/login' , async (req,res)=>{
   const {username , password} = req.body;

   const user = await prisma.user.findFirst({where:{
      username:username
   }})

   if(!user) res.status(400).json("user does't exists");

   const dbPassword = user.password;
   const comparePassword = await bcrypt.compare(password.toString() , dbPassword)
   if(!comparePassword) res.status(400).json('incorrect password');

   const accessToken = createTokens(user)

   res.cookie("access_token" , accessToken , {
      maxAge:60*60*24*30*1000
   })

   res.json("LOGGED IN");

})
app.get('/profile' , validateToken , (req,res)=>{
   res.json("profile")
})

app.listen(3000 , ()=> console.log('live on localhost:3000'))