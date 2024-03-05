const {sign , verify} = require('jsonwebtoken')

const createTokens = (user) => {
   const accessToken = sign({'username':user.username , 'id':user.id} , "myToken")
   return accessToken;
}

const validateToken = (req,res,next) => {
   const accessToken = req.cookies['access_token'];

   if(!accessToken) return res.status(400).json('un authenticated user')

   try {
      const validToken = verify(accessToken , "myToken")
      if(validToken){
         req.authenticated = true;
         return next();
      }else{
         throw new Error("not Authenticated")
      }
   } catch (error) {
      return res.status(400).json(error)
   }
   
}

module.exports = {createTokens ,validateToken }