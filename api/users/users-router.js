const express = require('express');
const Users=require('./users-model')
const Posts=require('./../posts/posts-model')
const { 
        validateUserId,
        validateUser,
        validatePost }=require('./../middleware/middleware')

const router = express.Router();

//return an array with all users
router.get('/',(req, res,next) => {
   Users.get()
        .then(users=>{
          res.status(200).json(users)
        })
        .catch(next)
  
});


//return the user object
router.get('/:id', validateUserId ,(req, res) => {
  res.status(200).json(req.user)
  
});
 
//return the newly created user object
router.post('/', validateUser, (req, res,next) => {
  Users.insert({name:req.name})
       .then(newUser=>{
        res.status(201).json(newUser)
       })
       .catch(next)

  
});
//return the freshly updated user object
router.put('/:id', validateUserId, validateUser, (req, res,next) => {
  Users.update(req.params.id,{name:req.name})
       .then(()=>{
        return Users.getById(req.params.id)
       })
       .then(user=>{
        res.status(200).json(user)
       })
       .catch(next)
  
 
});
//return the freshly deleted user object
router.delete('/:id', validateUserId,(req, res,next) => {
  Users.remove(req.params.id)
       .then(()=>{
        res.status(200).json(req.user)
       })
       .catch(next)
});
//return the array of user posts
router.get('/:id/posts', validateUserId,(req, res,next) => {
  Users.getUserPosts(req.params.id)
       .then(post=>{
        res.status(200).json(post)
       })
       .catch(next)
  
});
//return the newly created user post
router.post('/:id/posts', validateUserId, validatePost,(req, res,next) => {
  Posts.insert({ user_id:req.params.id,text:req.text})
       .then(post=>{
        res.status(201).json(post)
       })
       .catch(next)
});
//注释告诉 ESLint 在这一行上禁用规则检查，所以不会产生与该行代码相关的警告或错误
//next没有使用，所以常规情况下，总是会有红色下划线
router.use((err,req,res,next)=>{ //eslint-disable-line
  res.status(err.status||500).json({
    message:err.message
  })
})
module.exports=router;
