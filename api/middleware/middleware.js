const Posts=require('./../posts/posts-model')
const Users=require('./../users/users-model')
function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get('Origin')}`
  )
  next()
}

async function validateUserId(req, res, next) {
   try{
     const user = await Users.getById(req.params.id)
     if(user){
      req.user=user
      next()
     }else{
       next({ status: 404, message: "user not found" })
     }

   }catch(err){
    next(err)
   }
}

async function validateUser(req, res, next) {
  const {name}=req.body
  if (name!==undefined&&
      typeof name=== 'string'&&
      name.length&&
      name.trim().length
    ){
      req.name=name.trim()
      next()
    }else{
    next({ status: 400, message: "missing required name field" })
    }
 
  
}

async function validatePost(req, res, next) {
  const { text } = req.body
  if (text !== undefined &&
    typeof text === 'string' &&
    text.length &&
    text.trim().length
  ) {
    req.text=text.trim()
    next()
  } else {
    next({ status: 400, message: "missing required text field" })
  }
}

// do not forget to expose these functions to other module
module.exports={
  logger,
  validateUserId,
  validateUser,
  validatePost
}